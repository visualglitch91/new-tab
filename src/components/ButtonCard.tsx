import { JSXInternal } from "preact/src/jsx";
import { clsx } from "../utils/general";
import Paper from "./Paper";
import "./ButtonCard.css";

export default function ButtonCard({
  class: className,
  disabled,
  style,
  buttonRef,
  ...props
}: Omit<JSXInternal.HTMLAttributes<HTMLButtonElement>, "style" | "ref"> & {
  style?: JSXInternal.CSSProperties;
  buttonRef?: JSXInternal.HTMLAttributes<HTMLButtonElement>["ref"];
}) {
  return (
    <Paper
      style={style}
      class={clsx(
        "component__button-card",
        disabled && "component__button-card--disabled",
        className
      )}
    >
      <button {...props} ref={buttonRef} disabled={disabled} />
    </Paper>
  );
}
