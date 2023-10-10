import { ScheduledTask, UnscheduledTask } from "@home-control/types/ticktick";

type Task = ScheduledTask | UnscheduledTask;

export function getStartOfToday() {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  return startOfToday;
}

export function getEndOfTomorrow() {
  const now = new Date();
  const endOfTomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 2
  );
  endOfTomorrow.setMilliseconds(-1); // Set to one millisecond before midnight

  return endOfTomorrow;
}

export function getTodayAndTomorrowEvents(events: Task[]) {
  const today = getStartOfToday();
  const tomorrow = getEndOfTomorrow();
  //@ts-ignore

  tomorrow.setDate(today.getDate() + 1);

  const todayEvents: Task[] = [];
  const tomorrowEvents: Task[] = [];
  const unscheduledEvents: Task[] = [];

  events.forEach((event) => {
    if (!("startDate" in event)) {
      unscheduledEvents.push(event);
      return;
    }

    const startDate = new Date(event.startDate);

    if (startDate >= today && startDate < tomorrow) {
      if (startDate.getDate() === today.getDate()) {
        todayEvents.push(event);
      } else {
        tomorrowEvents.push(event);
      }
    }
  });

  return {
    unscheduled: unscheduledEvents,
    today: todayEvents,
    tomorrow: tomorrowEvents,
  };
}
