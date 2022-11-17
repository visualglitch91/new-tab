import BScroll from "better-scroll";
import { isTouchDevice } from "./general";

export type ManagedScroll = ReturnType<typeof managedScroll>;

export default function managedScroll(wrapper: HTMLElement) {
  let bscroll: BScroll | null;

  function scrollTo(y: number) {
    if (bscroll) {
      bscroll.scrollTo(0, y);
    }

    wrapper.scrollTo(0, y);
  }

  function enable() {
    if (!isTouchDevice) {
      return;
    }

    scrollTo(0);
    wrapper.style.overflow = "hidden";
    bscroll = new BScroll(wrapper, {
      click: true,
      scrollY: true,
      momentumLimitTime: 100,
      swipeTime: 1000,
      swipeBounceTime: 200,
      flickLimitDistance: 0,
    });
  }

  function disable() {
    if (!isTouchDevice || !bscroll) {
      return;
    }

    scrollTo(0);
    bscroll.destroy();
    bscroll = null;
    wrapper.style.overflow = "auto";
  }

  function update() {
    if (bscroll) {
      bscroll.refresh();
    }
  }

  return {
    enable,
    disable,
    update,
    scrollTo,
  };
}
