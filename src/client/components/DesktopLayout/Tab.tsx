import { styled } from "@mui/joy";
import { cx } from "../../utils/styles";
import RippleButton from "../RippleButton";
import Icon from "../Icon";

export const Wrapper = styled(RippleButton)(({ theme }) => ({
  margin: 0,
  padding: "0 16px",
  border: "none",
  borderRight: "2px solid transparent",
  outline: "none",
  background: "transparent",
  fontSize: "13px",
  color: "inherit",
  display: "flex",
  flexDirection: "row",
  columnGap: "6px",
  alignItems: "center",
  justifyContent: "flex-start",
  cursor: "pointer",
  height: 64,
  transition: "all 80ms cubic-bezier(0.76, 0, 0.24, 1)",
  "& > i": { fontSize: "26px" },
  "&:hover": { background: "rgba(0, 0, 0, 0.1)" },
  "&.active": {
    fontWeight: "bolder",
    borderColor: theme.palette.primary[400],
  },
}));

const Title = styled("span")({
  marginTop: 1,
});

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
      <Title>{title}</Title>
    </Wrapper>
  );
}
