import { clearValue, loadValue, saveValue } from "./storage";

const performanceDataVersion = 9;

class DevicePerformance {
  private score: number = -1;

  async setup() {
    console.log("Getting performance score from cache");

    const cached = loadValue<{ version: number; value: number }>(
      "device-performance"
    );

    if (cached && cached.version === performanceDataVersion) {
      this.score = cached.value;
      return;
    }

    console.log("Performance score not found, calculating");

    const startTime = Date.now();
    const iterations = 500_000_000;

    for (let i = 0; i < iterations; i++) {
      Math.pow(Math.random(), 2);
    }

    const ellapsedTime = Date.now() - startTime;

    console.log(`Performance score is ${ellapsedTime}, less is better`);

    saveValue("device-performance", {
      version: performanceDataVersion,
      value: ellapsedTime,
    });

    this.score = ellapsedTime;
  }

  async recalculate() {
    clearValue("device-performance");
    return this.setup();
  }

  getScore() {
    if (this.score < 0) {
      throw new Error("Device Performance score not set");
    }

    return this.score;
  }
}

const devicePerformance = new DevicePerformance();

export default devicePerformance;
