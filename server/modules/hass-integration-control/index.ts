import ky from "ky";
import WebSocket from "ws";
import { createAppModule } from "$server/utils";
import config from "$server/config";

const { url: hassUrl, token } = config.home_assistant;

export default createAppModule("hass-integration-control", (instance) => {
  function toggle(ids: string[], action: "enable" | "disable") {
    return new Promise<void>((resolve) => {
      const { host, protocol } = new URL(hassUrl);

      const ws = new WebSocket(
        `${protocol === "http:" ? "ws" : "wss"}://${host}/api/websocket`
      );

      ws.on("open", () => {
        let i = 1;

        ws.send(JSON.stringify({ type: "auth", access_token: token }));

        setTimeout(() => {
          ids.forEach((id) => {
            const data = {
              type: "config_entries/disable",
              entry_id: id,
              disabled_by: action === "disable" ? "user" : null,
              id: i++,
            };

            ws.send(JSON.stringify(data));
          });

          setTimeout(() => {
            ws.close();
            resolve();
          }, 500);
        }, 500);
      });
    });
  }

  instance.post<{ Body: { ids: string[] } }>("/enable", async (req) => {
    await toggle(req.body.ids, "enable");
  });

  instance.post<{ Body: { ids: string[] } }>("/disable", async (req) => {
    await toggle(req.body.ids, "disable");
  });

  instance.post<{ Body: { ids: string[] } }>("/reload", async (req) => {
    const { ids } = req.body;

    for (const id of ids) {
      await ky.post(`${hassUrl}/api/config/config_entries/entry/${id}/reload`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  });
});
