import { Button, styled } from "@mui/material";

const AltIconButton = styled(Button)({
  borderRadius: "100%",
  minWidth: 0,
  padding: 6,
  "&.MuiButton-sizeMedium": { padding: 8 },
  "&.MuiButton-sizeLarge": { padding: 12 },
});

AltIconButton.defaultProps = {
  disableElevation: true,
  size: "small",
  color: "glossy",
  variant: "contained",
};

export default AltIconButton;
