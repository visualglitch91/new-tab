import { keyBy } from "lodash";
import { differenceInCalendarDays, format, subDays } from "date-fns";
import objectid from "bson-objectid";
import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import { Habit } from "@home-control/types/ticktick";

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

  getAllUncompletedTasks() {
    return callAPI("v2/batch/check/0", "GET").then(
      ({ inboxId, projectProfiles, syncTaskBean }) => {
        const projectsById = keyBy(projectProfiles, "id");

        return syncTaskBean.update.map((task: any) => ({
          ...task,
          projectName:
            task.projectId === inboxId
              ? "Inbox"
              : projectsById[task.projectId].name,
        }));
      }
    );
  }

  getCalenderEvents() {
    return callAPI("v2/calendar/bind/events/all", "GET").then(
      (res) => res.events
    );
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
