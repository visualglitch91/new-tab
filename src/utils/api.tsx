import ky, { Options as KYOptions } from "ky";
import { getAccessToken } from "./hass";

export default function api<T = any>(
  path: string,
  method: string,
  body?: any,
  options?: KYOptions
): Promise<T> {
  return ky(`${process.env.SIDEKICK_URL}/api${path}`, {
    ...options,
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
    json: body,
  }).json();
}
