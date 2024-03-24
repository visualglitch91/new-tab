import { styled } from "@mui/material";
import { getConfig } from "$client/utils/useConfig";

const enableBlur = !getConfig("disableBlurEffects");

const GlossyPaper = styled("div")(({ theme }) => ({
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  backgroundColor: "rgba(28, 34, 48,0.5)",
  boxShadow: "rgb(25, 25, 25) 3px 3px 13px -6px",
  borderRadius: theme.shape.borderRadius,
  color: "white",
  backdropFilter: enableBlur ? "blur(20px)" : undefined,
}));

export default GlossyPaper;
