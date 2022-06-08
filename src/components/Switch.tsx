import { JSXInternal } from "preact/src/jsx";
import "./Switch.css";

export default function Switch({
  checked,
  disabled,
  onInput,
}: {
  checked: boolean;
  disabled?: boolean;
  onInput: (e: JSXInternal.TargetedEvent<HTMLInputElement, Event>) => void;
}) {
  return (
    <label class="component__switch">
      <input
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onInput={(e) => {
          /*
           * Preact has some bug that changes
           * the checkbox state despite the
           * checked prop
           */
          e.currentTarget.checked = checked;
          onInput(e);
        }}
      />
      <i />
    </label>
  );
}
