import { parse, subMilliseconds } from "date-fns";

export function normalizeDate(date: string, isAllDay = false) {
  if (isAllDay) {
    return subMilliseconds(
      parse(date.substring(0, 10), "yyyy-MM-dd", new Date()),
      1
    );
  }

  return new Date(date);
}
