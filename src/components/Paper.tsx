import { ComponentChildren } from "preact";
import { JSXInternal } from "preact/src/jsx";
import { clsx } from "../utils/general";
import "./Paper.css";

export default function Paper({
  class: className,
  children,
  style,
}: {
  class?: string;
  children: ComponentChildren;
  style?: JSXInternal.CSSProperties;
}) {
  return (
    <div style={style} class={clsx("component__paper", className)}>
      {children}
    </div>
  );
}
