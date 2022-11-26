import BScroll from "better-scroll";

export type ManagedScroll = ReturnType<typeof managedScroll>;

export default function managedScroll(wrapper: HTMLElement) {
  let bscroll: BScroll | null;

  function scrollTo(y: number, animated = false) {
    if (bscroll) {
      bscroll.scrollTo(0, y, animated ? 250 : undefined);
    }

    wrapper.scrollTo(0, y);
  }

  function enable() {
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

    bscroll.on("scrollStart", () => {
      window.dispatchEvent(new Event("bscroll:scrollStart"));
    });
  }

  function disable() {
    if (!bscroll) {
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
