import { Link } from "wouter";
import Icon from "$client/components/Icon";
import { TabRoot, TabTitle } from "./components";

export default function Tab({
  icon,
  path,
  label,
  active,
}: {
  icon: string;
  path: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link to={path}>
      <TabRoot
        startIcon={<Icon icon={icon} />}
        variant={active ? "contained" : "text"}
      >
        <TabTitle>{label}</TabTitle>
      </TabRoot>
    </Link>
  );
}
