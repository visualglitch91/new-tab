import { getAccessToken } from "./hass";

export default function api<T = any>(
  path: string,
  method: string,
  body?: any
): Promise<T> {
  return fetch(`/api${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());
}
