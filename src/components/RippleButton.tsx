import { forwardRef, useEffect, useRef, useState } from "react";
import ListenerGroup from "../utils/ListenerGroup";
import { css, styled } from "../styling";
import Timer from "../utils/Timer";
import useLatestRef from "../utils/useLatestRef";
import { isTouchDevice } from "../utils/general";

const PRESS_AND_HOLD_REPEAT = 120;

const StyledButton = styled(
  "button",
  css`
    position: relative;
    display: inline-flex;
    overflow: hidden;
    cursor: pointer;

    & * {
      pointer-events: none;
    }
  `
);

const initialRippleStyle: React.CSSProperties = {
  position: "absolute",
  borderRadius: "50%",
  opacity: 0,
  width: 35,
  height: 35,
  transform: "translate(-50%, -50%)",
  pointerEvents: "none",
};

const config = {
  during: 600,
  color: "rgba(0, 0, 0, .3)",
};

interface RippleProps {
  top: number;
  left: number;
  size: number;
  "data-key": string;
  onDone: () => void;
}

function getPointFromEvent(e: any): [number, number] {
  return "touches" in e && e.touches.length > 0
    ? [e.touches[0].pageX, e.touches[0].pageY]
    : "changedTouches" in e && e.changedTouches.length > 0
    ? [e.changedTouches[0].pageX, e.changedTouches[0].pageY]
    : [e.pageX, e.pageY];
}

function Ripple({ top, left, size, "data-key": key, onDone }: RippleProps) {
  const [style, setStyle] = useState(initialRippleStyle);

  useEffect(() => {
    const timer = new Timer("timeout");

    setStyle({
      ...initialRippleStyle,
      left,
      top,
      opacity: 1,
      transform: "translate(-50%, -50%)",
      transition: "initial",
      backgroundColor: config.color,
    });

    timer.start(() => {
      setStyle((prev) => ({
        ...prev,
        opacity: 0,
        transform: `scale(${size / 9})`,
        transition: `all ${config.during}ms`,
      }));

      timer.start(onDone, config.during);
    }, 25);

    return () => {
      timer.stop();
    };
    //eslint-disable-next-line
  }, []);

  return <span data-key={key} style={style} />;
}

const RippleButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    onHold?: () => void;
    onLongPress?: () => void;
  }
>(({ onClick, onHold, onLongPress, ...props }, externalRef) => {
  const internalRef = useRef<HTMLButtonElement>(null);
  const buttonRef = externalRef || internalRef;
  const counterRef = useRef(0);
  const [ripples, setRipples] = useState<(RippleProps & { key: string })[]>([]);
  const pressAndHoldRef = useRef(false);
  const pressAndHoldTimeoutRef = useRef(0);
  const onHoldRef = useLatestRef(onHold);
  const onLongPressRef = useLatestRef(onLongPress);

  useEffect(() => {
    const listenerGroup = new ListenerGroup();

    const button =
      (buttonRef && "current" in buttonRef && buttonRef.current) || null;

    function createRipple(pageX: number, pageY: number) {
      const rect = button!.getBoundingClientRect();
      const key = (++counterRef.current).toString();
      const left = pageX - (rect.left + window.scrollX);
      const top = pageY - (rect.top + window.scrollY);
      const size = Math.max(rect.width, rect.height);

      setRipples((prev) => [
        ...prev,
        {
          key,
          left,
          top,
          size,
          "data-key": key,
          onDone: () => {
            setRipples((prev) => prev.filter((it) => it.key !== key));
          },
        },
      ]);
    }

    if (button) {
      let onLongPressCalled = false;

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

      listenerGroup
        .with(button)
        .subscribe(isTouchDevice ? "touchstart" : "mousedown", (e) => {
          createRipple(...getPointFromEvent(e));

          pressAndHoldTimeoutRef.current = window.setTimeout(
            pressAndHoldCallback,
            PRESS_AND_HOLD_REPEAT
          );
        });

      listenerGroup
        .with(button)
        .subscribe(isTouchDevice ? "touchend" : "mouseup", () => {
          window.clearTimeout(pressAndHoldTimeoutRef.current);

          setTimeout(() => {
            onLongPressCalled = false;
            pressAndHoldRef.current = false;
          }, 2);
        });
    }

    return () => {
      listenerGroup.unsubscribeAll();
      window.clearTimeout(pressAndHoldTimeoutRef.current);
    };
  }, [
    onHoldRef,
    buttonRef,
    onLongPressRef,
    pressAndHoldRef,
    pressAndHoldTimeoutRef,
  ]);

  return (
    <StyledButton
      {...props}
      ref={buttonRef}
      onClick={(e) => {
        if (onClick && !pressAndHoldRef.current) {
          onClick(e);
        }
      }}
    >
      {props.children}
      {ripples.map(({ key, ...props }) => (
        <Ripple {...props} key={key} />
      ))}
    </StyledButton>
  );
});

export type RippleButtonProps = React.ComponentProps<typeof RippleButton>;

export default RippleButton;
