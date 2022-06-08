import { useEffect, useState } from "preact/hooks";
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

  function toggle(e: JSXInternal.TargetedEvent<HTMLInputElement, Event>) {
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

  useEffect(() => {
    if (checked === togglingTo) {
      setTogglingTo(undefined);
    }
  }, [checked, togglingTo]);

  return (
    <Switch
      disabled={toggling}
      checked={toggling ? togglingTo : checked}
      onInput={toggle}
    />
  );
}
