import { useMemo, useRef } from "react";
import useLatestRef from "./useLatestRef";
import { isTouchDevice } from "./general";

const PRESS_AND_HOLD_REPEAT = 120;

export default function useLongPress({
  onHold,
  onClick,
  onLongPress,
}: {
  onHold?: () => void;
  onClick?: () => void;
  onLongPress?: () => void;
}) {
  const pressAndHoldRef = useRef(false);
  const pressAndHoldTimeoutRef = useRef(0);
  const onHoldRef = useLatestRef(onHold);
  const onLongPressRef = useLatestRef(onLongPress);
  const onClickRef = useLatestRef(onClick);

  const props = useMemo(() => {
    let onLongPressCalled = false;

    const onClick = () => {
      if (!pressAndHoldRef.current) {
        onClickRef.current?.();
      }
    };

    const pressAndHoldCallback = () => {
      if (!onLongPressCalled) {
        onLongPressCalled = true;
        onLongPressRef.current?.();
      }

      pressAndHoldRef.current = true;
      onHoldRef.current?.();

      pressAndHoldTimeoutRef.current = window.setTimeout(
        pressAndHoldCallback,
        PRESS_AND_HOLD_REPEAT
      );
    };

    const onMouseDown = () => {
      pressAndHoldTimeoutRef.current = window.setTimeout(
        pressAndHoldCallback,
        PRESS_AND_HOLD_REPEAT
      );
    };

    const onMouseUp = () => {
      window.clearTimeout(pressAndHoldTimeoutRef.current);

      setTimeout(() => {
        onLongPressCalled = false;
        pressAndHoldRef.current = false;
      }, 2);
    };

    if (isTouchDevice) {
      return {
        onClick,
        onTouchStart: onMouseDown,
        onTouchEnd: onMouseUp,
      };
    }

    return {
      onClick,
      onMouseDown,
      onMouseUp,
    };
  }, [pressAndHoldRef, onClickRef, onLongPressRef, onHoldRef]);

  return props;
}
