import { Schedule } from "$app/types/hass-scheduler";

function padNumber(value: number) {
  return String(value).padStart(2, "0");
}

export function formatTime(time: Schedule["time"]) {
  const hour = padNumber(time.hour);
  const minute = padNumber(time.minute);
  return `${hour}:${minute}`;
}
