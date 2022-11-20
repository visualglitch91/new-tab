import { PointerListener } from "contactjs";
import { useEffect, useRef, useState } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import useLatestRef from "../utils/useLatestRef";
import { clsx, isTouchDevice } from "../utils/general";
import "./ButtonCard.css";

function noop() {}

export interface TouchButtonProps {
  class?: string;
  disabled?: boolean;
  type?: JSXInternal.HTMLAttributes<HTMLButtonElement>["type"];
  children?: JSXInternal.HTMLAttributes<HTMLButtonElement>["children"];
  style?: JSXInternal.CSSProperties;
  onTap?: () => void;
  onPress?: () => void;
  onHold?: () => void;
  onDoubleTap?: () => void;
}

export default function TouchButton({
  class: className,
  disabled,
  onTap = noop,
  onPress = noop,
  onHold = noop,
  onDoubleTap,
  ...props
}: TouchButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [state, setState] = useState({
    tapping: false,
    hovering: false,
    pressing: false,
  });

  const handlerRefs = useLatestRef({
    onTap,
    onPress,
    onHold,
    onDoubleTap,
  });

  useEffect(() => {
    const button = buttonRef.current;

    if (!button) {
      return;
    }

    new PointerListener(button, { handleTouchEvents: false });

    let doubleTapTimeout = 0;
    let holdInterval = 0;

    function updateState(key: keyof typeof state, flag: boolean) {
      setState((p) => ({ ...p, [key]: flag }));
    }

    function clearIntervals() {
      window.clearTimeout(doubleTapTimeout);
      doubleTapTimeout = 0;

      window.clearInterval(holdInterval);
      holdInterval = 0;
    }

    if (!isTouchDevice) {
      button.addEventListener("mouseenter", () => {
        updateState("hovering", true);
      });

      button.addEventListener("mouseleave", () => {
        updateState("hovering", false);
      });
    }

    button.addEventListener("tap", () => {
      const { onTap, onDoubleTap } = handlerRefs.current;

      if (doubleTapTimeout && onDoubleTap) {
        clearIntervals();
        updateState("tapping", false);
        onDoubleTap();
      } else {
        updateState("tapping", true);

        if (!onDoubleTap) {
          onTap();
        }

        doubleTapTimeout = window.setTimeout(() => {
          clearIntervals();
          updateState("tapping", false);

          if (onDoubleTap) {
            onTap();
          }
        }, 200);
      }
    });

    button.addEventListener("touchstart", () => {
      updateState("pressing", true);
    });

    button.addEventListener("touchend", () => {
      updateState("pressing", false);
    });

    button.addEventListener("press", () => {
      clearIntervals();
      handlerRefs.current.onPress();

      holdInterval = window.setInterval(() => {
        handlerRefs.current.onHold();
      }, 500);
    });

    button.addEventListener("pressend", () => {
      clearIntervals();
    });

    return () => {
      window.clearTimeout(doubleTapTimeout);
      window.clearInterval(holdInterval);
    };
  }, [handlerRefs]);

  return (
    <button
      {...props}
      disabled={disabled}
      class={clsx(
        className,
        disabled && "disabled",
        (state.hovering || state.tapping || state.pressing) && "highlight"
      )}
      ref={buttonRef}
    />
  );
}
