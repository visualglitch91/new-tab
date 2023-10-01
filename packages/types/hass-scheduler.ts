export type Actions = {
  domain: string;
  service: string;
  data?: any;
}[];

export interface Timer {
  id: string;
  name: string;
  duration: number;
  actions: Actions;
  startedAt: number;
}

export interface Schedule {
  id: string;
  name: string;
  enabled: boolean;
  days: {
    sunday?: boolean;
    monday?: boolean;
    tuesday?: boolean;
    wednesday?: boolean;
    thursday?: boolean;
    friday?: boolean;
    saturday?: boolean;
  };
  time: {
    hour: number;
    minute: number;
  };
  actions: Actions;
}

export interface SimpleAction {
  on: boolean;
  entityId: string;
}
