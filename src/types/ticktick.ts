export type ScheduledTask = {
  id: string;
  title: string;
  dueDate: string;
} & ({ projectId: string; type: "task" } | { type: "event" });

export interface UnscheduledTask {
  id: string;
  title: string;
  projectId: string;
  type: "task";
}

export interface Habit {
  habitId: string;
  checkinId: string;
  name: string;
  goal: number;
  value: number;
}

export interface TickTickData {
  scheduled: ScheduledTask[];
  unscheduled: UnscheduledTask[];
  habits: Habit[];
}
