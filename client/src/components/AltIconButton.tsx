import { Button, styled } from "@mui/material";

const AltIconButton = styled(Button)({
  borderRadius: "100%",
  minWidth: "var(--size)",
  maxWidth: "var(--size)",
  minHeight: "var(--size)",
  maxHeight: "var(--size)",
  "--size": "32px",
  "&.MuiButton-sizeMedium": { "--size": "42px" },
  "&.MuiButton-sizeLarge": { "--size": "48px" },
});

AltIconButton.defaultProps = {
  disableElevation: true,
  size: "small",
  color: "glossy",
  variant: "contained",
};

export default AltIconButton as typeof Button;
