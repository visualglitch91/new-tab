import { addDays, format } from "date-fns";

export function checkDate(fullDate: Date) {
  const today = format(new Date(), "yyyy-MM-dd");
  const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
  const date = format(fullDate, "yyyy-MM-dd");

  if (date < today) {
    return "past";
  }

  if (date === today) {
    return "today";
  } else if (date === tomorrow) {
    return "tomorrow";
  }

  return "future";
}
