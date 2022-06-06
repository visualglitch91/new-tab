import { h, useState } from "../utils/preact.mjs";
import Switch from "./Switch.mjs";

export default function DelayedSwitch({
  checked,
  checkDelay,
  uncheckDelay,
  onInput,
}) {
  const [togglingTo, setTogglingTo] = useState(undefined);
  const toggling = typeof togglingTo !== "undefined";

  function toggle(e) {
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

  return h`
    <${Switch}
      disabled=${toggling}
      checked=${toggling ? togglingTo : checked}
      onInput=${toggle}
    />
  `;
}
