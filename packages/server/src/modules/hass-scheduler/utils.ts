import axios from "axios";
import { Actions } from "@home-control/types/hass-scheduler";
import { config } from "../../../../../config";
import { logger } from "../../utils";

const { url: hassUrl, token } = config.home_assistant;

export function runActions(actions: Actions) {
  return Promise.all(
    actions.map((action) =>
      axios
        .post(
          `${hassUrl}/api/services/${action.domain}/${action.service}`,
          action.data,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .catch((err) => {
          logger.error(err);
        })
    )
  );
}
