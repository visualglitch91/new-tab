import { useEffect, useState } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import DotLoading from "./DotLoading";
import Switch from "./Switch";

export default function DelayedSwitch({
  checked,
  delay,
  onInput,
}: {
  checked: boolean;
  delay: number;
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
  }

  useEffect(() => {
    if (checked === togglingTo) {
      setTogglingTo(undefined);
    }
  }, [checked, togglingTo]);

  useEffect(() => {
    if (typeof togglingTo === "boolean") {
      const timeout = window.setTimeout(() => setTogglingTo(undefined), delay);
      return () => clearTimeout(timeout);
    }
  }, [delay, togglingTo]);

  if (toggling) {
    return <DotLoading />;
  }

  return (
    <Switch
      disabled={toggling}
      checked={toggling ? togglingTo : checked}
      onInput={toggle}
    />
  );
}
