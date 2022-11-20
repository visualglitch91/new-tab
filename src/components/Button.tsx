import { clsx } from "../utils/general";
import TouchButton, { TouchButtonProps } from "./TouchButton";
import "./Button.css";

export default function Button({
  class: className,
  ...props
}: TouchButtonProps) {
  return (
    <TouchButton {...props} class={clsx("component__button", className)} />
  );
}
