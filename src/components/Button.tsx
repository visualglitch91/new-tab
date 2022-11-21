import { clsx } from "../utils/general";
import TouchButton, { TouchButtonProps } from "./TouchButton";
import "./Button.css";

export default function Button({ className, ...props }: TouchButtonProps) {
  return (
    <TouchButton {...props} className={clsx("component__button", className)} />
  );
}
