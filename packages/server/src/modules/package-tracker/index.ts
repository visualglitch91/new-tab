import { job } from "cron";
import storage from "./storage";
import refresh from "./refresh";
import { createAppModule } from "../../utils";

export default createAppModule("package-tracker", (instance, logger) => {
  job("0 * * * *", () => {
    logger.info("refreshing package statuses...");
    refresh(logger);
  }).start();

  instance.get("/list", async () => storage.getAll());

  instance.post<{ Body: { name: string; code: string } }>(
    "/add",
    async (req) => {
      storage.save({
        id: req.body.code,
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
