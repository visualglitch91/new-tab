import { styled } from "@mui/joy";
import { cx } from "../../utils/styles";
import RippleButton from "../RippleButton";
import Icon from "../Icon";

export const Wrapper = styled(RippleButton)({
  margin: 0,
  padding: "0 18px",
  border: "none",
  borderRadius: 16,
  outline: "none",
  background: "transparent",
  fontSize: "14px",
  color: "inherit",
  display: "flex",
  flexDirection: "row",
  columnGap: "12px",
  alignItems: "center",
  justifyContent: "flex-start",
  cursor: "pointer",
  height: 64,
  fontWeight: "bolder",
  transition: "all 80ms cubic-bezier(0.76, 0, 0.24, 1)",
  "& > i": { fontSize: "26px" },
  "&:hover": { background: "rgba(10, 10, 10, 0.2)" },
  "&.active": { background: "rgba(10, 10, 10, 0.3)" },
  "&:hover.active": { background: "rgba(10, 10, 10, 0.4)" },
});

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
