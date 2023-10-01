import { CronJob, job as createJob } from "cron";
import CronTime from "cron-time-generator";
import ObjectID from "bson-objectid";
import {
  Schedule,
  Timer as TimerData,
} from "@home-control/types/hass-scheduler";
import { createAppModule } from "../../utils";
import Storage from "../../storage";
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
    Body: Omit<TimerData, "id" | "startedAt" | "name"> & { name?: string };
  }>("/timers", async (req) => {
    const id = String(ObjectID());

    timers[id] = new Timer(
      {
        ...req.body,
        id,
        startedAt: Date.now(),
        name: req.body.name || `Timer ${Object.keys(timers).length + 1}`,
      },
      () => deleteTimer(id)
    );

    return timers[id].toJSON();
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

    jobs[schedule.id] = createJob(cronString, () => {
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

  instance.get<{
    Params: { id: string };
  }>("/schedule", async () => {
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

    if (!current) {
      res.status(404);
      throw new Error();
    }

    if (current.enabled && body.enabled === false) {
      stopSchedule(id);
    }

    storage.save({
      ...current,
      ...body,
      id,
    });

    return { success: true };
  });
});
