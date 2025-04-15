import { darken, styled } from "@mui/material";
import { getConfig } from "$app/utils/useConfig";

const enableBlur = !getConfig("disableBlurEffects");

const GlossyPaper = styled("div")(({ theme }) => ({
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  borderRadius: theme.shape.borderRadius,
  color: "white",
  backgroundColor: darken(theme.palette.base.main, 0.2),
  "body.mobile &": {
    backgroundColor: "rgba(28, 34, 48,0.5)",
    boxShadow: "rgb(25, 25, 25) 3px 3px 13px -6px",
    backdropFilter: enableBlur ? "blur(20px)" : undefined,
  },
}));

export default GlossyPaper;
