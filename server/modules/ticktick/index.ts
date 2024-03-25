import { groupBy } from "lodash";
import {
  addDays,
  endOfDay,
  isBefore,
  isSameDay,
  startOfDay,
  subMilliseconds,
} from "date-fns";
import { createAppModule } from "$server/utils";
import config from "$server/config";
import TickTick from "./ticktick";
import { normalizeDate } from "./utils";

const tick = new TickTick();

const {
  username,
  password,
  project_ids: projectIds,
  excluded_calendar_ids: excludedCalendarIds,
} = config.ticktick;

export default createAppModule("ticktick", async (instance, logger) => {
  await tick.login({ username, password });

  logger.info("ticktick logged in");

  instance.get("/data", () => {
    const now = new Date();
    const since = startOfDay(now);
    const until = endOfDay(addDays(now, 1));

    return Promise.all([
      // Delayed
      tick.getUncompletedTasks(
        new Date(0),
        subMilliseconds(since, 1),
        projectIds
      ),

      // Today, tomorrow and unscheduled
      tick.getCalendar(since, until, projectIds, excludedCalendarIds),

      // Today's habits
      tick.getTodayHabits(),
    ]).then(
      ([
        { scheduled: delayed = [] },
        { scheduled, unscheduled },
        habits = [],
      ]) => {
        const { today = [], tomorrow = [] } = groupBy(scheduled, (it) => {
          const startDate = new Date(it.startDate);
          const endDate = new Date(it.endDate);

          if (isSameDay(startDate, until)) {
            return "tomorrow";
          }

          if (
            isSameDay(startDate, now) &&
            (it.isAllDay || isBefore(now, endDate))
          ) {
            return "today";
          }

          return "other";
        });

        return {
          delayed,
          today,
          tomorrow,
          unscheduled,
          habits,
        };
      }
    );
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

  instance.get<{ Query: { since: string; until: string } }>(
    "/calendar",
    async (req) => {
      const since = startOfDay(normalizeDate(req.query.since, true));
      const until = endOfDay(normalizeDate(req.query.until, true));

      const { scheduled } = await tick.getCalendar(
        since,
        until,
        projectIds,
        excludedCalendarIds
      );

      return scheduled;
    }
  );
});
