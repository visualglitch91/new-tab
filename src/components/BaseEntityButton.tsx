import { PointerListener } from "contactjs";
import { useEffect, useRef } from "preact/hooks";
import { clsx } from "../utils/general";
import Icon from "./Icon";
import ButtonCard from "./ButtonCard";
import useAsyncChange from "../utils/useAsyncChange";
import CircularLoading from "./CircularLoading";
import "./BaseEntityButton.css";

export default function BaseEntityButton({
  icon,
  label,
  unavailable,
  checked,
  backgroundColor,
  changeTimeout = 0,
  onPrimaryAction = () => {},
  onSecondaryAction = () => {},
}: {
  icon?: string;
  label?: string;
  unavailable?: boolean;
  checked?: boolean;
  backgroundColor?: string;
  changeTimeout?: number;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const onTapRef = useRef(() => {});
  const onPressRef = useRef(() => {});

  useEffect(() => {
    const button = buttonRef.current;

    if (!button) {
      return;
    }

    new PointerListener(button, { handleTouchEvents: false });

    let doubleTapTimeout = 0;

    function clearDoubleTapTimeout() {
      window.clearTimeout(doubleTapTimeout);
      doubleTapTimeout = 0;
    }

    button.addEventListener("tap", () => {
      if (doubleTapTimeout) {
        clearDoubleTapTimeout();
        onPressRef.current();
      } else {
        doubleTapTimeout = window.setTimeout(() => {
          clearDoubleTapTimeout();
          onTapRef.current();
        }, 200);
      }
    });

    button.addEventListener("press", () => {
      clearDoubleTapTimeout();
      onPressRef.current();
    });
  }, []);

  const { changing, change } = useAsyncChange({
    flag: checked || false,
    timeout: changeTimeout,
  });

  onTapRef.current = () => {
    if (change()) {
      onPrimaryAction();
    }
  };

  onPressRef.current = () => {
    onSecondaryAction();
  };

  return (
    <ButtonCard
      disabled={unavailable}
      class={clsx(
        "component__base-entity-button",
        checked && !changing && "component__base-entity-button--on"
      )}
      style={
        backgroundColor && !changing
          ? { backgroundColor, borderColor: "transparent" }
          : undefined
      }
      buttonRef={buttonRef}
    >
      {changing ? (
        <CircularLoading />
      ) : (
        <>
          <Icon icon={unavailable ? "cancel" : icon || "cancel"} />
          <div class="component__base-entity-button__label">{label}</div>
        </>
      )}
    </ButtonCard>
  );
}
