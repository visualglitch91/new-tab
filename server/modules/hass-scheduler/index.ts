import { omit } from "lodash";
import { CronJob } from "cron";
import CronTime from "cron-time-generator";
import ObjectID from "bson-objectid";
import { differenceInSeconds } from "date-fns";
import { Schedule, Timer as TimerData } from "$common/types/hass-scheduler";
import { createAppModule, logger } from "$server/utils";
import Storage from "$server/storage";
import Timer from "./Timer";
import { runActions } from "./utils";

export default createAppModule("hass-scheduler", (instance) => {
  const timers: Record<string, Timer> = {};

  function deleteTimer(id: string) {
    if (timers[id]) {
      timers[id].cancel();
      delete timers[id];
    }
  }

  /*
   * Timer
   */
  instance.get<{
    Params: { id: string };
  }>("/timers", async () => {
    return Object.values(timers).map((timer) => timer.toJSON());
  });

  instance.post<{
    Body: Omit<TimerData, "id" | "startedAt" | "name" | "duration"> & {
      name?: string;
    } & (
        | { until?: undefined; duration: number }
        | { until: string; duration?: undefined }
      );
  }>("/timers", async (req) => {
    const id = String(ObjectID());

    const duration =
      typeof req.body.duration === "number"
        ? req.body.duration
        : differenceInSeconds(new Date(req.body.until), new Date());

    timers[id] = new Timer(
      {
        ...req.body,
        id,
        duration,
        startedAt: Date.now(),
        name: req.body.name || `Timer ${Object.keys(timers).length + 1}`,
      },
      () => deleteTimer(id)
    );

    return timers[id].toJSON();
  });

  instance.delete<{
    Query: { name: string };
  }>("/timers", async (req) => {
    const ids = Object.values(timers)
      .map((timer) => timer.toJSON())
      .filter((it) => it.name === req.query.name)
      .map((it) => it.id);

    if (ids.length) {
      ids.forEach(deleteTimer);
    }

    return { deleted: true };
  });

  instance.delete<{
    Params: { id: string };
  }>("/timers/:id", async (req) => {
    deleteTimer(req.params.id);
    return { deleted: true };
  });

  /*
   * Schedules
   */

  const storage = new Storage<Schedule>("hass-scheduler");
  const jobs: Record<string, CronJob> = {};

  function scheduleJob(schedule: Schedule) {
    if (jobs[schedule.id] || schedule.enabled === false) {
      return;
    }

    const days = Object.entries(schedule.days).reduce(
      (acc, [day, bool]) => (bool ? [...acc, day] : acc),
      [] as string[]
    );

    if (days.length === 0) {
      return;
    }

    const cronString = CronTime.onSpecificDaysAt(
      days,
      schedule.time.hour,
      schedule.time.minute
    );

    jobs[schedule.id] = new CronJob(cronString, () => {
      logger.info(
        { schedule: omit(schedule, "actions") },
        "Running schedule on time"
      );

      runActions(schedule.actions);
    });

    jobs[schedule.id].start();
  }

  function stopSchedule(id: string) {
    if (jobs[id]) {
      jobs[id].stop();
      delete jobs[id];
    }
  }

  storage.getAll().forEach(scheduleJob);

  instance.get("/schedule", async () => {
    return storage.getAll();
  });

  instance.post<{
    Body: Omit<Schedule, "id" | "enabled" | "name"> & { name?: string };
  }>("/schedule", async (req) => {
    const schedule: Schedule = {
      ...req.body,
      id: String(ObjectID()),
      enabled: true,
      name: req.body.name || `Agendamento ${storage.count() + 1}`,
    };

    scheduleJob(schedule);
    storage.save(schedule);

    return { success: true };
  });

  instance.post<{
    Params: { id: string };
  }>("/schedule/:id/run-now", (req, res) => {
    const schedule = storage.get(req.params.id);

    if (schedule) {
      logger.info(
        { schedule: omit(schedule, "actions") },
        "Running schedule now"
      );

      runActions(schedule.actions);
      res.sendStatus(201);
      return;
    }

    res.sendStatus(404);
    return;
  });

  instance.delete<{
    Params: { id: string };
  }>("/schedule/:id", async (req) => {
    const id = req.params.id;

    stopSchedule(id);
    storage.remove(id);

    return { success: true };
  });

  instance.patch<{
    Params: { id: string };
    Body: Partial<Schedule>;
  }>("/schedule/:id", async (req, res) => {
    const {
      body,
      params: { id },
    } = req;

    const current = storage.get(id);
    const next = { ...current, ...body, id };

    if (!current) {
      res.status(404);
      throw new Error();
    }

    if (current.enabled && body.enabled === false) {
      stopSchedule(id);
    } else if (!current.enabled && body.enabled === true) {
      scheduleJob(next);
    }

    storage.save(next);

    return { success: true };
  });
});
