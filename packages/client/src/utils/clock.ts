let timeout: NodeJS.Timeout | null = null;

function msUntilNextSecond() {
  const currentMs = new Date().getMilliseconds();
  const msUntilNextSecond = 1000 - currentMs;
  return msUntilNextSecond;
}

function tick() {
  window.dispatchEvent(new Event("clock-tick"));
  timeout = setTimeout(tick, 1000);
}

function start() {
  if (timeout) {
    return;
  }

  timeout = setTimeout(tick, msUntilNextSecond());
}

function on(handler: () => void) {
  window.addEventListener("clock-tick", handler);
  return () => off(handler);
}

function off(handler: () => void) {
  window.removeEventListener("clock-tick", handler);
}

const clock = {
  on,
  off,
  start,
  stop,
};

export default clock;
