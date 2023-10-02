import { styled } from "@mui/joy";
import Icon from "./Icon";
import { SxProps } from "@mui/joy/styles/types";

const Wrapper = styled("button")(({ theme }) => ({
  height: "100%",
  margin: 0,
  padding: "6px 8px",
  border: "none",
  outline: "none",
  fontSize: "11px",
  color: theme.palette.primary[400],
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "background 60ms linear",
  borderRadius: "5px",
  fontWeight: "bolder",
  textTransform: "uppercase",
  background: "rgba(0, 0, 0, 0.1)",
  columnGap: "6px",
  "&:hover": { background: " rgba(0, 0, 0, 0.3)" },
}));

export default function PillButton({
  className,
  sx,
  icon,
  label,
  onClick,
}: {
  className?: string;
  sx?: SxProps;
  icon?: string;
  label?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Wrapper type="button" sx={sx} className={className} onClick={onClick}>
      {icon && <Icon size={14} icon={icon} />}
      {label}
    </Wrapper>
  );
}
