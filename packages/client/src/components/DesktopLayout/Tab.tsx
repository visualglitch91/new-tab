import { cx } from "../../utils/styles";
import Icon from "../Icon";
import { TabRoot, TabTitle } from "./components";

export default function Tab({
  active,
  title,
  icon,
  onClick,
}: {
  active: boolean;
  title: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <TabRoot type="button" className={cx(active && "active")} onClick={onClick}>
      <Icon icon={icon} />
      <TabTitle>{title}</TabTitle>
    </TabRoot>
  );
}
