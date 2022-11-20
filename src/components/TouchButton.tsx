import { PointerListener } from "contactjs";
import { useEffect, useRef, useState } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import useLatestRef from "../utils/useLatestRef";
import { clsx, isTouchDevice } from "../utils/general";
import "./TouchButton.css";

function noop() {}

export interface TouchButtonProps {
  class?: string;
  disabled?: boolean;
  type?: JSXInternal.HTMLAttributes<HTMLButtonElement>["type"];
  children?: JSXInternal.HTMLAttributes<HTMLButtonElement>["children"];
  style?: JSXInternal.CSSProperties;
  onMouseDown?: JSXInternal.HTMLAttributes<HTMLButtonElement>["onMouseDown"];
  onTap?: () => void;
  onPress?: () => void;
  onHold?: () => void;
  onDoubleTap?: () => void;
}

export default function TouchButton({
  class: className,
  children,
  disabled,
  onTap = noop,
  onPress = noop,
  onHold = noop,
  onDoubleTap,
  ...props
}: TouchButtonProps) {
  const mountedRef = useRef(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [ripples, setRipples] = useState<
    {
      key: string;
      size: number;
      top: number;
      left: number;
    }[]
  >([]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

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

    function createRipple(x: number, y: number) {
      const rect = button!.getBoundingClientRect();
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;
      const key = Date.now().toString();

      setRipples((p) => [
        ...p,
        {
          key,
          size: diameter,
          left: x - (rect.left + radius),
          top: y - (rect.top + radius),
        },
      ]);

      setTimeout(() => {
        if (mountedRef.current) {
          setRipples((p) => p.filter((it) => it.key !== key));
        }
      }, 600);
    }

    function clearIntervals() {
      window.clearTimeout(doubleTapTimeout);
      doubleTapTimeout = 0;

      window.clearInterval(holdInterval);
      holdInterval = 0;
    }

    if (!isTouchDevice) {
      button.addEventListener("mousedown", (event) => {
        createRipple(event.clientX, event.clientY);
      });

      button.addEventListener("mouseenter", () => {
        updateState("hovering", true);
      });

      button.addEventListener("mouseleave", () => {
        updateState("hovering", false);
      });
    } else {
      button.addEventListener("touchstart", (event) => {
        createRipple(event.touches[0].clientX, event.touches[0].clientY);
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
        "component__touch-button",
        className,
        disabled && "disabled",
        (state.hovering || state.pressing) && "highlight"
      )}
      ref={buttonRef}
    >
      {children}
      <div class="component__touch-button__ripple-container">
        {ripples.map((it) => (
          <span
            key={it.key}
            class="component__touch-button__ripple"
            style={{
              height: it.size,
              width: it.size,
              top: it.top,
              left: it.left,
            }}
          />
        ))}
      </div>
    </button>
  );
}
