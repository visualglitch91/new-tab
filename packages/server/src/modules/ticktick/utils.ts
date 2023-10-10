function getStartOfToday() {
  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  return startOfToday;
}

function getEndOfTomorrow() {
  const now = new Date();

  const endOfTomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 2
  );

  endOfTomorrow.setMilliseconds(-1); // Set to one millisecond before midnight

  return endOfTomorrow;
}

export function checkDate(date: Date) {
  const today = getStartOfToday();
  const tomorrow = getEndOfTomorrow();

  tomorrow.setDate(today.getDate() + 1);

  if (date < today) {
    return "past";
  }

  if (date >= today && date < tomorrow) {
    if (date.getDate() === today.getDate()) {
      return "today";
    } else {
      return "tomorrow";
    }
  }

  return "future";
}
