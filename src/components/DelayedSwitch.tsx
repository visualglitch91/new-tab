import { useState } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import Switch from "./Switch";

export default function DelayedSwitch({
  checked,
  checkDelay,
  uncheckDelay,
  onInput,
}: {
  checked: boolean;
  checkDelay: number;
  uncheckDelay: number;
  onInput: (e: JSXInternal.TargetedEvent<HTMLInputElement, Event>) => void;
}) {
  const [togglingTo, setTogglingTo] = useState<boolean | undefined>(undefined);
  const toggling = typeof togglingTo !== "undefined";

  function toggle(e: InputEvent) {
    if (toggling) {
      return;
    }

    const next = !checked;

    onInput(e);
    setTogglingTo(next);
    setTimeout(
      () => setTogglingTo(undefined),
      next ? checkDelay : uncheckDelay
    );
  }

  return (
    <Switch
      disabled={toggling}
      checked={toggling ? togglingTo : checked}
      onInput={toggle}
    />
  );
}
