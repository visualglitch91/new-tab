import { Link } from "wouter";
import Icon from "$app/components/Icon";
import { SxProps } from "$app/theme/utils";
import { TabRoot, TabTitle } from "./components";

export default function Tab({
  icon,
  path,
  label,
  active,
  sx,
}: {
  icon: string;
  path: string;
  label: string;
  active: boolean;
  sx?: SxProps;
}) {
  return (
    <Link to={path}>
      <TabRoot
        sx={sx}
        startIcon={<Icon icon={icon} />}
        variant={active ? "contained" : "text"}
      >
        <TabTitle>{label}</TabTitle>
      </TabRoot>
    </Link>
  );
}
