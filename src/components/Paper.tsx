import { ComponentChildren } from "preact";
import { clsx } from "../utils/general";
import "./Paper.css";

export default function Paper({
  class: className,
  children,
  onClick,
}: {
  class?: string;
  children: ComponentChildren;
  onClick?: () => void;
}) {
  return (
    <div class={clsx("component__paper", className)} onClick={onClick}>
      {children}
    </div>
  );
}
