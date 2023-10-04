export function disableEmotionWarnings() {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const log = console.error.bind(console);

  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("The pseudo class") &&
      args[0].includes(
        "is potentially unsafe when doing server-side rendering. Try changing it to"
      )
    ) {
      return;
    }

    log(...args);
  };
}
