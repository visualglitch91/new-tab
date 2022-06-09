import { clamp, isTouchDevice } from "./general";

export type ManagedScroll = ReturnType<typeof managedScroll>;

function getTranslateY(element: HTMLElement) {
  return Number(/\.*translateY\((.*)px\)/i.exec(element.style.transform)![1]);
}

export default function managedScroll(wrapper: HTMLElement) {
  const element = wrapper.children[0] as HTMLElement;

  let enabled = false;
  let scrolling = false;

  let lastTouchPosition = 0;
  let currentElementPosition = 0;

  function scroll() {
    element.style.transform = `translateY(${currentElementPosition}px)`;

    if (scrolling) {
      requestAnimationFrame(scroll);
    }
  }

  function onTouchStart(e: TouchEvent) {
    if (scrolling) {
      return;
    }

    lastTouchPosition = e.touches[0].clientY;
    currentElementPosition = getTranslateY(element);

    scrolling = true;
    scroll();
  }

  function onTouchMove(e: TouchEvent) {
    if (!scrolling) {
      return;
    }

    const position = e.touches[0].clientY;
    const deltaPosition = position - lastTouchPosition;

    lastTouchPosition = position;

    currentElementPosition = clamp(
      currentElementPosition + deltaPosition,
      -(element.offsetHeight - wrapper.offsetHeight),
      0
    );
  }

  function onTouchEnd() {
    scrolling = false;
  }

  function scrollTo(y: number) {
    if (enabled) {
      currentElementPosition = y;
      scroll();
    }

    wrapper.scrollTo(0, y);
  }

  function enable() {
    if (!isTouchDevice) {
      return;
    }

    enabled = true;
    scrollTo(0);

    wrapper.style.overflow = "hidden";
    wrapper.addEventListener("touchstart", onTouchStart);
    wrapper.addEventListener("touchmove", onTouchMove);
    wrapper.addEventListener("touchend", onTouchEnd);
  }

  function disable() {
    if (!isTouchDevice) {
      return;
    }

    scrollTo(0);
    enabled = false;

    wrapper.style.overflow = "auto";
    wrapper.removeEventListener("touchstart", onTouchStart);
    wrapper.removeEventListener("touchmove", onTouchMove);
    wrapper.removeEventListener("touchend", onTouchEnd);
  }

  return {
    enable,
    disable,
    scrollTo,
  };
}
