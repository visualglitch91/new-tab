import _humanizeDuration from "humanize-duration";

export function formatSecondsToMinutesAndSeconds(seconds: number) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00"; // Handle invalid input
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

export function humanizeDuration(
  duration: number,
  options?: _humanizeDuration.Options
) {
  return _humanizeDuration(duration, {
    round: true,
    language: "pt",
    ...options,
  });
}
