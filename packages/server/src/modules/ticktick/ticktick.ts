import { keyBy, orderBy, sortBy, uniqBy } from "lodash";
import {
  format,
  isEqual,
  subDays,
  endOfDay,
  startOfDay,
  isWithinInterval,
  differenceInCalendarDays,
} from "date-fns";
import objectid from "bson-objectid";
import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import {
  Habit,
  ScheduledTask,
  UnscheduledTask,
} from "@home-control/types/ticktick";
import { normalizeDate } from "./utils";
import { rrulestr } from "rrule";

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

function tickStamp(date: Date) {
  return format(date, "yyyy-MM-dd").split("-").join("");
}

function callAPI<T = any>(
  path: string,
  method: string,
  data?: any
): Promise<T> {
  return client
    .request({
      method,
      url: `https://ticktick.com/api/${path}`,
      data,
      headers: {
        "Content-Type": "application/json",
        Origin: "https://ticktick.com",
        "x-device": JSON.stringify({
          platform: "web",
          os: "Linux x86_64",
          device: "Chrome 114.0.0.0",
          name: "",
          version: 4531,
          id: "6488ceeb59aa0918a4b5fa85",
          channel: "website",
          campaign: "",
          websocket: "",
        }),
      },
    })
    .then((res) => res.data);
}

export default class TickTick {
  login({ username, password }: { username: string; password: string }) {
    return callAPI("v2/user/signon?wc=true&remember=true", "POST", {
      username,
      password,
    }).then((res) => {
      if (typeof res?.username === "undefined") {
        throw new Error("Could not login");
      }
    });
  }

  async getUncompletedTasks(
    since: Date,
    until: Date,
    projectIds = new Array<string>()
  ) {
    const scheduled: ScheduledTask[] = [];
    const unscheduled = new Array<UnscheduledTask>();

    const { inboxId, projectProfiles, syncTaskBean } = await callAPI(
      "v2/batch/check/0",
      "GET"
    );

    const projectsById = keyBy(projectProfiles, "id");
    const rawTasks = syncTaskBean.update;

    rawTasks.forEach((rawTask: any) => {
      if (rawTask.status !== 0 || !projectIds.includes(rawTask.projectId)) {
        return;
      }

      const projectName =
        rawTask.projectId === inboxId
          ? "Inbox"
          : projectsById[rawTask.projectId].name;

      if (!rawTask.dueDate) {
        unscheduled.push({
          id: rawTask.id,
          title: rawTask.title,
          projectId: rawTask.projectId,
          projectName,
          type: "task",
          raw: rawTask,
        });

        return;
      }

      let startDate = new Date(rawTask.startDate);
      let dueDate = new Date(rawTask.dueDate);

      if (rawTask.isAllDay) {
        startDate = startOfDay(startDate);
        dueDate = endOfDay(startDate);
      }

      if (!isWithinInterval(startDate, { start: since, end: until })) {
        return;
      }

      scheduled.push({
        id: rawTask.id,
        projectId: rawTask.projectId,
        projectName,
        title: rawTask.title,
        startDate: startDate.toISOString(),
        endDate: dueDate.toISOString(),
        isAllDay: rawTask.isAllDay,
        type: "task",
        raw: rawTask,
      });
    });

    return { scheduled: sortBy(scheduled, "startDate"), unscheduled };
  }

  async getEvents(
    since: Date,
    until: Date,
    excludedCalendarIds = new Array<string>()
  ) {
    const scheduled: ScheduledTask[] = [];

    const { events: rawEvents } = await callAPI(
      "v2/calendar/bind/events/all",
      "GET"
    );

    rawEvents.forEach((calendar: any) => {
      if (excludedCalendarIds.includes(calendar.id)) {
        return;
      }

      calendar.events.forEach((rawEvent: any) => {
        try {
          if (
            rawEvent.attendees?.find((attendee: any) => attendee.self === true)
              ?.responseStatus === "declined"
          ) {
            return;
          }
        } catch (_) {}

        const startDate = normalizeDate(rawEvent.dueStart, rawEvent.isAllDay);

        const startDates = rawEvent.repeatFlag
          ? rrulestr(rawEvent.repeatFlag, { dtstart: startDate }).between(
              since,
              until,
              true
            )
          : [startDate];

        startDates.forEach((startDate) => {
          let endDate: Date | null = normalizeDate(
            rawEvent.dueEnd,
            rawEvent.isAllDay
          );

          if (rawEvent.repeatFlag) {
            endDate = rrulestr(rawEvent.repeatFlag, {
              dtstart: endDate,
            }).after(startDate);
          }

          if (!endDate) {
            return;
          }

          if (!isWithinInterval(startDate, { start: since, end: until })) {
            return;
          }

          if (
            rawEvent.eXDates?.some((dateStr: string) =>
              isEqual(startDate!, new Date(dateStr))
            )
          ) {
            return;
          }

          scheduled.push({
            id: `${rawEvent.id}@${calendar.id}`,
            title: rawEvent.title,
            projectId: calendar.id,
            projectName: calendar.name,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            isAllDay: rawEvent.isAllDay,
            type: "event",
            raw: rawEvent,
          });
        });
      });
    });

    return uniqBy(
      orderBy(scheduled, ["startDate"], ["desc"]),
      (it) => `${it.raw.uid}--${format(new Date(it.startDate), "yyyy-MM-dd")}`
    ).reverse();
  }

  async getCalendar(
    since: Date,
    until: Date,
    projectIds = new Array<string>(),
    excludedCalendarIds = new Array<string>()
  ) {
    const [{ scheduled: scheduledTasks, unscheduled }, scheduledEvents] =
      await Promise.all([
        this.getUncompletedTasks(since, until, projectIds),
        this.getEvents(since, until, excludedCalendarIds),
      ]);

    return {
      unscheduled,
      scheduled: sortBy([...scheduledTasks, ...scheduledEvents], "startDate"),
    };
  }

  async getTodayHabits(): Promise<Habit[]> {
    interface Checkin {
      habitId: string;
      id: string;
      opTime: string;
      status: 0 | 1 | 2;
      value: number;
    }

    const habits = await callAPI<{ id: string; name: string; goal: number }[]>(
      "v2/habits",
      "GET"
    );

    const today = new Date();

    const checkins = await callAPI<Record<string, Checkin[]>>(
      "v2/habitCheckins/query",
      "POST",
      {
        habitIds: habits.map((it: any) => it.id),
        afterStamp: tickStamp(subDays(new Date(), 1)),
      }
    ).then((res) => res.checkins);

    const checkinsByHabitId = Object.values(checkins)
      .flat()
      .filter(
        (it: any) => differenceInCalendarDays(new Date(it.opTime), today) === 0
      )
      .reduce<Record<string, Checkin>>((acc, it: any) => {
        return { ...acc, [it.habitId]: it };
      }, {});

    return habits.map((habit: any) => {
      const checkin = checkinsByHabitId[habit.id];

      return {
        habitId: habit.id,
        checkinId: checkin?.id,
        name: habit.name,
        goal: habit.goal,
        value: checkin?.value || 0,
        raw: habit,
      };
    });
  }

  async checkinHabit(habitId: string) {
    const habit = (await this.getTodayHabits()).find(
      (it) => it.habitId === habitId
    );

    if (!habit) {
      throw new Error("habit not found");
    }

    if (habit.value === habit.goal) {
      return;
    }

    const value = habit.value + 1;
    const status = value === habit.goal ? 2 : 0;

    const checkin = {
      checkinStamp: tickStamp(new Date()),
      opTime: new Date(),
      goal: habit.goal,
      habitId,
      id: habit.checkinId || objectid(),
      status,
      value,
    };

    return callAPI("v2/habitCheckins/batch", "POST", {
      add: !habit.checkinId ? [checkin] : [],
      update: habit.checkinId ? [checkin] : [],
      delete: [],
    });
  }

  async completeTask(id: string, projectId: string) {
    const task = await callAPI(`v2/task/${id}?projectId=${projectId}`, "GET");

    if (!task) {
      throw new Error("task not found");
    }

    const now = new Date();

    return callAPI("v2/batch/task", "POST", {
      add: [],
      update: [
        {
          ...task,
          status: 2,
          modifiedTime: now,
          completedTime: now,
          timeZone: "America/Sao_Paulo",
        },
      ],
      delete: [],
      addAttachments: [],
      updateAttachments: [],
      deleteAttachments: [],
    });
  }
}
