import { ComponentChildren } from "preact";
import { clsx } from "../utils/general";
import "./Button.css";

export default function Button({
  class: className,
  children,
  onClick,
}: {
  class?: string;
  children: ComponentChildren;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      class={clsx("component__button", className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
