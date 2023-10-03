import { styled } from "@mui/material";

const SectionTitle = styled("h2")({
  fontSize: 28,
  fontWeight: 600,
  margin: 0,
  display: "flex",
  gap: "8px",
  alignItems: "center",
  "& > *": { flexShrink: 0 },
});

export default SectionTitle;
