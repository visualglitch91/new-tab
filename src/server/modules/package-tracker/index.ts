//@ts-expect-error
import cron from "node-cron";
import storage from "./storage";
import refresh from "./refresh";
import { createAppModule } from "../../helpers";

export default createAppModule("package-tracker", (instance) => {
  cron.schedule("0 * * * *", () => {
    instance.log.info("refreshin packages...");
    refresh();
  });

  instance.get("/list", storage.read);

  instance.post<{ Body: { name: string; code: string } }>(
    "/add",
    async (req) => {
      const item = { name: req.body.name, code: req.body.code };

      await storage.add(item);
      await refresh();

      req.log.info("added: ", JSON.stringify(item));
    }
  );

  instance.post<{ Body: { code: string } }>("/remove", async (req) => {
    const { code } = req.body;

    await storage.remove(code);
    await refresh();

    req.log.info("removed: ", code);
  });

  instance.get("/refresh", async () => {
    await refresh();
  });
});
