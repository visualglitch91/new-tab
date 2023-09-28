import ButtonCard from "./ButtonCard";
import Icon from "./Icon";

export default function IconButtonCard({
  icon,
  size,
  action,
  repeatOnHold,
}: {
  icon: string;
  size: number;
  action: () => void;
  repeatOnHold?: boolean;
}) {
  const onHold = repeatOnHold ? action : undefined;

  return (
    <ButtonCard onClick={action} onLongPress={onHold} onHold={onHold}>
      <Icon icon={icon} size={size} />
    </ButtonCard>
  );
}
