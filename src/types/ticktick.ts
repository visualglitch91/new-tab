export type ScheduledTask = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  timeZone: string;
  isAllDay: boolean;
  projectId: string;
  projectName: string;
  type: "task" | "event";
  raw: any;
};

export interface UnscheduledTask {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
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
