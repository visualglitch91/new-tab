import { forwardRef, useEffect, useRef, useState } from "react";
import { isTouchDevice } from "../utils/general";
import { styled } from "../utils/styling";

const StyledButton = styled("button")`
  position: relative;
  display: inline-flex;
  overflow: hidden;
  & * {
    pointer-events: none;
  }
`;

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

function Ripple({ top, left, size, "data-key": key, onDone }: RippleProps) {
  const [style, setStyle] = useState(initialRippleStyle);

  useEffect(() => {
    let timer1 = 0;
    let timer2 = 0;

    setStyle({
      ...initialRippleStyle,
      left,
      top,
      opacity: 1,
      transform: "translate(-50%, -50%)",
      transition: "initial",
      backgroundColor: config.color,
    });

    timer1 = window.setTimeout(() => {
      setStyle((prev) => ({
        ...prev,
        opacity: 0,
        transform: `scale(${size / 9})`,
        transition: `all ${config.during}ms`,
      }));

      timer2 = window.setTimeout(onDone, config.during);
    }, 25);

    return () => {
      window.clearTimeout(timer1);
      window.clearTimeout(timer2);
    };
    //eslint-disable-next-line
  }, []);

  return <span data-key={key} style={style} />;
}

const RippleButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
  const counterRef = useRef(0);
  const [ripples, setRipples] = useState<(RippleProps & { key: string })[]>([]);

  useEffect(() => {
    let timer = 0;
    const button = (ref && "current" in ref && ref.current) || null;

    function createRipple(pageX: number, pageY: number) {
      window.clearTimeout(timer);

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
      if (isTouchDevice) {
        button.addEventListener("touchstart", (e) => {
          createRipple(e.touches[0].pageX, e.touches[0].pageY);
        });
      } else {
        button.addEventListener("mousedown", (e) => {
          createRipple(e.pageX, e.pageY);
        });
      }

      return () => {
        window.clearTimeout(timer);
      };
    }
  }, [ref]);

  return (
    <StyledButton {...props} ref={ref}>
      {props.children}
      {ripples.map(({ key, ...props }) => (
        <Ripple {...props} key={key} />
      ))}
    </StyledButton>
  );
});

export default RippleButton;
