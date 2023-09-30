export default class Timer {
  private timeout: number | null = null;

  constructor(private type: "interval" | "timeout") {}

  stop() {
    if (this.timeout) {
      window[this.type === "timeout" ? "clearTimeout" : "clearInterval"](
        this.timeout
      );

      this.timeout = null;
    }
  }

  start(callback: () => void, ms: number) {
    this.stop();
    this.timeout = window[
      this.type === "timeout" ? "setTimeout" : "setInterval"
    ](() => {
      if (this.type === "timeout") {
        this.timeout = null;
      }

      callback();
    }, ms);
  }
  isRunning() {
    return this.timeout !== null;
  }
}
