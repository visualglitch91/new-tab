import { differenceInCalendarDays, isWithinInterval } from "date-fns";
import TickTick from "./ticktick";
import { createAppModule } from "../../helpers";
import { ScheduledTask, UnscheduledTask } from "../../../types/ticktick";

const tick = new TickTick();
const appModule = createAppModule("ticktick");
const projectIds = process.env.TICKTICK_PROJECT_IDS!.split(",");

tick
  .login({
    username: process.env.TICKTICK_USERNAME!,
    password: process.env.TICKTICK_PASSWORD!,
  })
  .then(() => {
    appModule.log("login done");
  });

function removeTimezone(date: string) {
  return date.split("+")[0];
}

function fixTimezone(date: string) {
  return `${removeTimezone(date)}Z`;
}

appModule.get("/data", () => {
  return Promise.all([
    tick.getAllUncompletedTasks(),
    tick.getCalenderEvents(),
    tick.getTodayHabits(),
  ]).then(([tasks, calendars, habits]: any) => {
    let scheduled: ScheduledTask[] = [];
    const unscheduled: UnscheduledTask[] = [];
    const today = new Date();

    tasks.forEach((it: any) => {
      if (it.status !== 0 || !projectIds.includes(it.projectId)) {
        return;
      }

      if (it.dueDate) {
        scheduled.push({
          id: it.id,
          projectId: it.projectId,
          title: it.title,
          dueDate: fixTimezone(it.dueDate),
          type: "task",
        });
      } else {
        unscheduled.push({
          id: it.id,
          title: it.title,
          projectId: it.projectId,
          type: "task",
        });
      }
    });

    calendars.forEach((calendar: any) => {
      calendar.events.forEach((it: any) => {
        const startDate = new Date(removeTimezone(it.dueStart));
        const endDate = new Date(removeTimezone(it.dueEnd));

        const dueDate = isWithinInterval(today, {
          start: startDate,
          end: endDate,
        })
          ? today
          : startDate;

        scheduled.push({
          id: `${it.id}@${calendar.id}`,
          title: it.title,
          dueDate: dueDate.toISOString(),
          type: "event",
        });
      });
    });

    scheduled = scheduled.filter((it) => {
      const diff = differenceInCalendarDays(new Date(it.dueDate), today);

      if (it.type === "task") {
        return diff <= 7;
      }

      return diff >= 0 && diff <= 7;
    });

    scheduled = scheduled.sort((a, b) => {
      return differenceInCalendarDays(new Date(a.dueDate), new Date(b.dueDate));
    });

    return { scheduled, unscheduled, habits };
  });
});

appModule.post<{ Body: { habitId: string } }>("/habits/checkin", (req) => {
  return tick.checkinHabit(req.body.habitId).then(() => ({
    success: true,
  }));
});

appModule.post<{ Body: { id: string; projectId: string } }>(
  "/tasks/complete",
  (req) => {
    return tick.completeTask(req.body.id, req.body.projectId).then(() => ({
      success: true,
    }));
  }
);

export default appModule;
