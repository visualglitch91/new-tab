import { CronJob } from "cron";
import objectid from "bson-objectid";
import { createAppModule } from "$server/utils";
import storage from "./storage";
import refresh from "./refresh";

export default createAppModule("package-tracker", (instance, logger) => {
  new CronJob("0 * * * *", () => {
    logger.info("Refreshing package statuses...");
    refresh(logger);
  }).start();

  instance.get("/list", async () => storage.getAll());

  instance.post<{ Body: { name: string; code: string } }>(
    "/add",
    async (req) => {
      storage.save({
        id: objectid().toHexString(),
        code: req.body.code,
        name: req.body.name,
        status: "not-found",
        eventCount: 0,
      });

      await refresh(logger);
    }
  );

  instance.post<{ Body: { code: string } }>("/remove", async (req) => {
    const { code } = req.body;

    await storage.remove(code);
    await refresh(logger);
  });

  instance.get("/refresh", async () => {
    await refresh(logger);
    return undefined;
  });
});
