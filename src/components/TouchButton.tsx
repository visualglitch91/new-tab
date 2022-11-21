import { PointerListener } from "contactjs";
import { useEffect, useRef, useState } from "react";
import useLatestRef from "../utils/useLatestRef";
import { isTouchDevice } from "../utils/general";
import RippleButton from "./RippleButton";
import { cx } from "../utils/styling";

function noop() {}

export interface TouchButtonProps {
  className?: string;
  disabled?: boolean;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  children?: React.ButtonHTMLAttributes<HTMLButtonElement>["children"];
  style?: React.ButtonHTMLAttributes<HTMLButtonElement>["style"];
  onMouseDown?: React.ButtonHTMLAttributes<HTMLButtonElement>["onMouseDown"];
  onTap?: () => void;
  onPress?: () => void;
  onHold?: () => void;
  onDoubleTap?: () => void;
}

export default function TouchButton({
  children,
  className,
  onTap = noop,
  onPress = noop,
  onHold = noop,
  onDoubleTap,
  ...props
}: TouchButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [hover, setHover] = useState(false);

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

    function clearIntervals() {
      window.clearTimeout(doubleTapTimeout);
      doubleTapTimeout = 0;

      window.clearInterval(holdInterval);
      holdInterval = 0;
    }

    if (!isTouchDevice) {
      button.addEventListener("mouseenter", () => {
        setHover(true);
      });

      button.addEventListener("mouseleave", () => {
        setHover(false);
      });
    }

    button.addEventListener("tap", () => {
      const { onTap, onDoubleTap } = handlerRefs.current;

      if (doubleTapTimeout && onDoubleTap) {
        clearIntervals();
        onDoubleTap();
      } else {
        if (!onDoubleTap) {
          onTap();
        }

        doubleTapTimeout = window.setTimeout(() => {
          clearIntervals();

          if (onDoubleTap) {
            onTap();
          }
        }, 200);
      }
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
    <RippleButton
      {...props}
      className={cx(className, hover && "hover", props.disabled && "disabled")}
      ref={buttonRef}
    >
      {children}
    </RippleButton>
  );
}
