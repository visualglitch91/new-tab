import { styled } from "@mui/joy";
import { cx } from "../../utils/styles";
import RippleButton from "../RippleButton";
import Icon from "../Icon";

export const Wrapper = styled(RippleButton)(({ theme }) => ({
  margin: 0,
  padding: "0 10px",
  border: "none",
  borderRight: "2px solid transparent",
  outline: "none",
  background: "transparent",
  fontSize: "11px",
  color: "inherit",
  display: "flex",
  flexDirection: "column",
  rowGap: "3px",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  textTransform: "uppercase",
  height: 64,
  transition: "all 80ms cubic-bezier(0.76, 0, 0.24, 1)",
  "& > i": { fontSize: "24px" },
  "&:hover": { background: "rgba(0, 0, 0, 0.1)" },
  "&.active": {
    fontWeight: "bolder",
    borderColor: theme.palette.primary[400],
  },
}));

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
    <Wrapper type="button" className={cx(active && "active")} onClick={onClick}>
      <Icon icon={icon} />
      {title}
    </Wrapper>
  );
}
