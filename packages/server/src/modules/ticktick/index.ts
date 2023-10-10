import { subDays } from "date-fns";
import { rrulestr } from "rrule";
import { ScheduledTask, UnscheduledTask } from "@home-control/types/ticktick";
import TickTick from "./ticktick";
import { createAppModule } from "../../utils";
import { config } from "../../../../../config";
import { checkDate } from "./utils";
import { sortBy } from "lodash";

const tick = new TickTick();

const {
  username,
  password,
  project_ids: projectIds,
  excluded_calendar_ids: excludedCalendarIds,
} = config.ticktick;

function removeTimezone(date: string) {
  return date.split("+")[0];
}

function fixTimezone(date: string) {
  return `${removeTimezone(date)}Z`;
}

export default createAppModule("ticktick", async (instance, logger) => {
  await tick.login({ username, password });

  logger.info("ticktick logged in");

  instance.get("/data", () => {
    return Promise.all([
      tick.getAllUncompletedTasks(),
      tick.getCalenderEvents(),
      tick.getTodayHabits(),
    ]).then(([tasks, calendars, habits]: any) => {
      const data = {
        today: new Array<ScheduledTask>(),
        delayed: new Array<ScheduledTask>(),
        tomorrow: new Array<ScheduledTask>(),
        unscheduled: new Array<UnscheduledTask>(),
      };

      tasks.forEach((it: any) => {
        if (it.status !== 0 || !projectIds.includes(it.projectId)) {
          return;
        }

        if (it.dueDate) {
          const dueDate = fixTimezone(it.dueDate);
          const when = checkDate(new Date(dueDate));
          let key: keyof typeof data;

          if (when === "future") return;
          else if (when === "past") key = "delayed";
          else key = when;

          data[key].push({
            id: it.id,
            projectId: it.projectId,
            title: it.title,
            startDate: fixTimezone(dueDate),
            endDate: fixTimezone(dueDate),
            isAllDay: it.isAllDay,
            type: "task",
          });
        } else {
          data.unscheduled.push({
            id: it.id,
            title: it.title,
            projectId: it.projectId,
            type: "task",
          });
        }
      });

      const yesterday = subDays(new Date(), 1);

      calendars.forEach((calendar: any) => {
        if (excludedCalendarIds.includes(calendar.id)) {
          return;
        }

        calendar.events.forEach((it: any) => {
          let startDate: Date | null = new Date(it.dueStart);
          let endDate: Date | null = new Date(it.dueEnd);

          if (it.repeatFlag) {
            startDate = rrulestr(it.repeatFlag, { dtstart: startDate }).after(
              yesterday
            );

            endDate = rrulestr(it.repeatFlag, { dtstart: endDate }).after(
              yesterday
            );
          }

          if (startDate === null || endDate === null) {
            return;
          }

          const key = checkDate(startDate);

          if (endDate < new Date()) {
            return;
          }

          if (key !== "future" && key !== "past") {
            data[key].push({
              id: `${it.id}@${calendar.id}`,
              title: it.title,
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
              isAllDay: it.isAllDay,
              type: "event",
            });
          }
        });
      });

      data.today = sortBy(data.today, "startDate");
      data.delayed = sortBy(data.delayed, "startDate");
      data.tomorrow = sortBy(data.tomorrow, "startDate");

      return { ...data, habits };
    });
  });

  instance.post<{ Body: { habitId: string } }>("/habits/checkin", (req) => {
    return tick.checkinHabit(req.body.habitId).then(() => ({
      success: true,
    }));
  });

  instance.post<{ Body: { id: string; projectId: string } }>(
    "/tasks/complete",
    (req) => {
      return tick.completeTask(req.body.id, req.body.projectId).then(() => ({
        success: true,
      }));
    }
  );
});
