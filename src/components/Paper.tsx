import { ComponentChildren } from "preact";
import { JSXInternal } from "preact/src/jsx";
import { clsx } from "../utils/general";
import "./Paper.css";

export default function Paper({
  class: className,
  children,
  style,
  onClick,
}: {
  class?: string;
  children: ComponentChildren;
  style?: JSXInternal.CSSProperties;
  onClick?: () => void;
}) {
  return (
    <div
      style={style}
      class={clsx("component__paper", className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
