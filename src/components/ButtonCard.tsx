import { clsx } from "../utils/general";
import TouchButton, { TouchButtonProps } from "./TouchButton";
import "./Paper.css";
import "./ButtonCard.css";

export type ButtonCardProps = TouchButtonProps;

export default function ButtonCard({
  class: className,
  ...props
}: ButtonCardProps) {
  return (
    <TouchButton
      {...props}
      class={clsx("component__paper", "component__button-card", className)}
    />
  );
}
