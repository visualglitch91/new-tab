import { omit } from "lodash";
import { Timer as TimerData } from "$common/types/hass-scheduler";
import { logger } from "$server/utils";
import { runActions } from "./utils";

export default class Timer {
  private config: TimerData;
  private timeout: NodeJS.Timeout;

  constructor(config: TimerData, onCompleted: () => void) {
    this.config = config;
    this.timeout = setTimeout(() => {
      logger.info({ timer: omit(this.config, "actions") }, "Running timer now");
      onCompleted();
      runActions(this.config.actions);
    }, config.duration * 1000);
  }

  cancel() {
    clearTimeout(this.timeout);
  }

  toJSON() {
    return { ...this.config };
  }
}
