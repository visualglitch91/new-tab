import HugeButton from "./HugeButton";
import Icon from "./Icon";

export default function IconHugeButton({
  icon,
  size,
  action,
}: {
  icon: string;
  size: number;
  action: () => void;
}) {
  return (
    <HugeButton onClick={action}>
      <Icon icon={icon} size={size} />
    </HugeButton>
  );
}
