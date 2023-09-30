import axios from "axios";
import { createAppModule } from "../../utils";
import { config } from "../../../../../config";

const { homeserver, token } = config.matrix;

export default createAppModule("matrix-bot", (instance) => {
  instance.post<{
    Body: { message: string; target: string; format?: "html" | "plain" };
  }>("/message", async (req) => {
    const { message, target, format } = req.body;

    const json =
      format === "html"
        ? {
            body: message.replace(/<\/?[a-z][a-z0-9]*[^<>]*>/gi, ""),
            formatted_body: message,
            format: "org.matrix.custom.html",
          }
        : { body: message };

    return axios
      .put(
        `${homeserver}/_matrix/client/v3/rooms/${target}/send/m.room.message/m${Date.now()}`,
        { ...json, msgtype: "m.text" },
        { timeout: 3_000, headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => res.data);
  });
});
