import Icon from "../Icon";
import { ButtonCardProps } from "../ButtonCard";
import useAsyncChange from "../../utils/useAsyncChange";
import CircularLoading from "../CircularLoading";
import { Label, Wrapper } from "./components";

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
    <Wrapper
      {...props}
      disabled={unavailable}
      on={Boolean(checked && !changing)}
      backgroundColor={
        backgroundColor && !changing ? backgroundColor : undefined
      }
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
          <Label>{label}</Label>
        </>
      )}
    </Wrapper>
  );
}
