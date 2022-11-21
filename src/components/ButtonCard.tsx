import { clsx } from "../utils/general";
import TouchButton, { TouchButtonProps } from "./TouchButton";
import "./Paper.css";
import "./ButtonCard.css";

export type ButtonCardProps = TouchButtonProps;

export default function ButtonCard({ className, ...props }: ButtonCardProps) {
  return (
    <TouchButton
      {...props}
      className={clsx("component__paper", "component__button-card", className)}
    />
  );
}
