export type ScheduledTask = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  isAllDay: boolean;
  raw: any;
} & ({ projectId: string; type: "task" } | { type: "event" });

export interface UnscheduledTask {
  id: string;
  title: string;
  projectId: string;
  type: "task";
  raw: any;
}

export interface Habit {
  habitId: string;
  checkinId: string;
  name: string;
  goal: number;
  value: number;
  raw: any;
}

export interface TickTickData {
  delayed: ScheduledTask[];
  today: ScheduledTask[];
  tomorrow: ScheduledTask[];
  unscheduled: UnscheduledTask[];
  habits: Habit[];
}
