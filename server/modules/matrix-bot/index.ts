import ky from "ky";
import { createAppModule } from "$server/utils";
import config from "$server/config";

const { homeserver, token } = config.matrix;

export default createAppModule("matrix-bot", (instance, logger) => {
  instance.post<{
    Body: { message: string; target: string; format?: "html" | "plain" };
  }>("/message", async (req) => {
    const { message, target, format } = req.body;

    const json =
      format === "html"
        ? {
            body: message
              .replace(/<br>/g, "\n")
              .replace(/<br\/>/g, "\n")
              .replace(/<br \/>/g, "\n")
              .replace(/<\/?[a-z][a-z0-9]*[^<>]*>/gi, ""),
            formatted_body: message,
            format: "org.matrix.custom.html",
          }
        : { body: message };

    const sendMessage = () =>
      ky
        .put(
          `${homeserver}/_matrix/client/v3/rooms/${target}/send/m.room.message/m${Date.now()}`,
          {
            json: { ...json, msgtype: "m.text" },
            timeout: 3_000,
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .json();

    const joinRoom = () =>
      ky
        .post(`${homeserver}/_matrix/client/v3/rooms/${target}/join`, {
          json: {},
          timeout: 3_000,
          headers: { Authorization: `Bearer ${token}` },
        })
        .json();

    return sendMessage().catch(({ response }) => {
      if (response.status === 403) {
        logger.warn("Trying to join room %s", target);
        return joinRoom().then(() => sendMessage());
      }

      throw response.data;
    });
  });
});
