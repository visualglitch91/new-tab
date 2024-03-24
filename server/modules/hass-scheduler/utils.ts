import ky from "ky";
import { Actions } from "$common/types/hass-scheduler";
import config from "$server/config";
import { logger } from "$server/utils";

const { url: hassUrl, token } = config.home_assistant;

export function runActions(actions: Actions) {
  return Promise.all(
    actions.map((action) =>
      ky
        .post(`${hassUrl}/api/services/${action.domain}/${action.service}`, {
          json: action.data,
          headers: { Authorization: `Bearer ${token}` },
        })
        .json()
        .catch((err) => logger.error(err))
    )
  );
}
