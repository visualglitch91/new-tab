import { styled } from "@mui/material";

export const borderRadius = "16px";

const GlossyPaper = styled("div")({
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  backgroundColor: "rgba(47, 59, 82,0.6)",
  boxShadow: "rgb(25, 25, 25) 3px 3px 13px -6px",
  borderRadius,
  color: "white",
});

export default GlossyPaper;
