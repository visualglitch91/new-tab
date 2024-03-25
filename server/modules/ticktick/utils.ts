import { parse } from "date-fns";

export function normalizeDate(date: string, isAllDay = false) {
  if (isAllDay) {
    return parse(date.substring(0, 10), "yyyy-MM-dd", new Date());
  }

  return new Date(date);
}
