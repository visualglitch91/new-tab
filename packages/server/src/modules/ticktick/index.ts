import { addSeconds, parse, subMilliseconds } from "date-fns";
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

function normalizeDate(date: string, isAllDay = false) {
  if (isAllDay) {
    return parse(date.substring(0, 10), "yyyy-MM-dd", new Date()).toISOString();
  }

  return new Date(date).toISOString();
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
          const dueDate = normalizeDate(it.dueDate, it.isAllDay);
          const when = checkDate(new Date(dueDate));
          let key: keyof typeof data;

          if (when === "future") return;
          else if (when === "past") key = "delayed";
          else key = when;

          data[key].push({
            id: it.id,
            projectId: it.projectId,
            title: it.title,
            startDate: dueDate,
            endDate: addSeconds(
              new Date(dueDate),
              24 * 60 * 60 - 1
            ).toISOString(),
            isAllDay: it.isAllDay,
            type: "task",
            raw: it,
          });
        } else {
          data.unscheduled.push({
            id: it.id,
            title: it.title,
            projectId: it.projectId,
            type: "task",
            raw: it,
          });
        }
      });

      const yesterday = subMilliseconds(new Date(), 1);

      calendars.forEach((calendar: any) => {
        if (excludedCalendarIds.includes(calendar.id)) {
          return;
        }

        calendar.events.forEach((it: any) => {
          let startDate: Date | null = new Date(
            normalizeDate(it.dueStart, it.isAllDay)
          );

          let endDate: Date | null = new Date(
            normalizeDate(it.dueEnd, it.isAllDay)
          );

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
              raw: it,
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
