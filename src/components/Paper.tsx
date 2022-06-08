import { ComponentChildren } from "preact";
import { clsx } from "../utils/general";
import "./Paper.css";

export default function Paper({
  class: className,
  children,
}: {
  class?: string;
  children: ComponentChildren;
}) {
  return <div class={clsx("component__paper", className)}>{children}</div>;
}
