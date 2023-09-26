import axios from "axios";
import { getAccessToken } from "./hass";

export default function api<T = any>(
  path: string,
  method: string,
  body?: any
): Promise<T> {
  return axios(`/api${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
    data: JSON.stringify(body),
  }).then((res) => res.data);
}
