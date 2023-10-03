import HugeButton from "./HugeButton";
import Icon from "./Icon";

export default function IconHugeButton({
  icon,
  size,
  action,
}: // repeatOnHold,
{
  icon: string;
  size: number;
  action: () => void;
  repeatOnHold?: boolean;
}) {
  // const onHold = repeatOnHold ? action : undefined;

  return (
    <HugeButton onClick={action} /*onLongPress={onHold} onHold={onHold}*/>
      <Icon icon={icon} size={size} />
    </HugeButton>
  );
}
