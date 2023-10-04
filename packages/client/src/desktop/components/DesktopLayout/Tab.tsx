import Icon from "../../../components/Icon";
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
    <TabRoot
      startIcon={<Icon icon={icon} />}
      variant={active ? "contained" : "text"}
      onClick={onClick}
    >
      <TabTitle>{title}</TabTitle>
    </TabRoot>
  );
}
