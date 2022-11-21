import { clsx } from "../utils/general";
import Icon from "./Icon";
import ButtonCard, { ButtonCardProps } from "./ButtonCard";
import useAsyncChange from "../utils/useAsyncChange";
import CircularLoading from "./CircularLoading";
import "./BaseEntityButton.css";

export default function BaseEntityButton({
  icon,
  label,
  unavailable,
  checked,
  backgroundColor,
  changeTimeout = 0,
  onTap,
  ...props
}: Pick<ButtonCardProps, "onTap" | "onPress" | "onHold" | "onDoubleTap"> & {
  icon?: string;
  label?: string;
  unavailable?: boolean;
  checked?: boolean;
  backgroundColor?: string;
  changeTimeout?: number;
}) {
  const { changing, change } = useAsyncChange({
    flag: checked || false,
    timeout: changeTimeout,
  });

  return (
    <ButtonCard
      {...props}
      disabled={unavailable}
      className={clsx(
        "component__base-entity-button",
        backgroundColor &&
          !changing &&
          "component__base-entity-button--custom-bg",
        checked && !changing && "component__base-entity-button--on"
      )}
      style={backgroundColor && !changing ? { backgroundColor } : undefined}
      onTap={() => {
        if (change() && onTap) {
          onTap();
        }
      }}
    >
      {changing ? (
        <CircularLoading />
      ) : (
        <>
          <Icon icon={unavailable ? "cancel" : icon || "cancel"} />
          <div className="component__base-entity-button__label">{label}</div>
        </>
      )}
    </ButtonCard>
  );
}
