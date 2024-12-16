import { styled } from "@mui/material";

const SectionTitle = styled("h2")({
  fontSize: 28,
  fontWeight: 600,
  margin: 0,
  display: "flex",
  flexDirection: "unset",
  justifyContent: "unset",
  gap: "12px",
  alignItems: "center",
  "& > *": { flexShrink: 0 },
  '[data-small-section-titles="true"] &': {
    fontSize: 18,
  },
  padding: undefined,
});

export default SectionTitle;
