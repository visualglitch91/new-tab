import { styled } from "@mui/joy";
import { cx } from "../../utils/styles";
import RippleButton from "../RippleButton";
import Icon from "../Icon";

export const Wrapper = styled(RippleButton)(({ theme }) => ({
  height: "100%",
  margin: 0,
  padding: "0 8px 0 8px",
  border: "none",
  borderTop: "2px solid transparent",
  outline: "none",
  background: "transparent",
  fontSize: "9px",
  color: "inherit",
  display: "flex",
  flexDirection: "column",
  rowGap: "3px",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  textTransform: "uppercase",
  flex: 1,
  transition: "all 80ms cubic-bezier(0.76, 0, 0.24, 1)",
  "& > i": { fontSize: "20px" },
  "&.hover": { background: "rgba(0, 0, 0, 0.1)" },
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
