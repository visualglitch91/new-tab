import { useEffect } from "react";
import useLatestRef from "./useLatestRef";

export default function useSwipe(
  el: HTMLElement,
  onSwipe: (direction: "right" | "left" | "up" | "down") => void
) {
  const onSwipeRef = useLatestRef(onSwipe);

  useEffect(() => {
    if (!el) {
      return;
    }

    el.addEventListener("touchstart", handleTouchStart, false);
    el.addEventListener("touchmove", handleTouchMove, false);

    let xDown = 0;
    let yDown = 0;

    function handleTouchStart(evt: TouchEvent) {
      xDown = evt.touches[0].clientX;
      yDown = evt.touches[0].clientY;
    }

    function handleTouchMove(evt: TouchEvent) {
      if (!xDown || !yDown) {
        return;
      }

      var xUp = evt.touches[0].clientX;
      var yUp = evt.touches[0].clientY;

      var xDiff = xDown - xUp;
      var yDiff = yDown - yUp;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        /*most significant*/
        if (xDiff > 0) {
          onSwipeRef.current("left");
        } else {
          onSwipeRef.current("right");
        }
      } else {
        if (yDiff > 0) {
          onSwipeRef.current("up");
        } else {
          onSwipeRef.current("down");
        }
      }
      /* reset values */
      xDown = 0;
      yDown = 0;
    }

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
    };
    //eslint-disable-next-line
  }, [el]);
}
