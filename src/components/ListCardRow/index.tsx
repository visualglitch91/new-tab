import Icon from "../Icon";
import { IconWrapper, Label, Wrapper } from "./components";

export default function ListCardRow({
  icon,
  label,
  children,
  disabled,
  onIconClick,
}: {
  icon?: string;
  children: React.ReactNode;
  label?: React.ReactNode;
  disabled?: boolean;
  onIconClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) {
  return (
    <Wrapper disabled={disabled}>
      {icon && (
        <IconWrapper onClick={onIconClick}>
          <Icon icon={icon} />
        </IconWrapper>
      )}
      <Label>{label}</Label>
      <div>{children}</div>
    </Wrapper>
  );
}
