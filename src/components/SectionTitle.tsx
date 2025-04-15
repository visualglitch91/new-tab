import { styled } from "@mui/material";

const SectionTitle = styled("h2")(({ theme }) => ({
  fontSize: 14,
  "body.mobile &": { fontSize: 16 },
  color: theme.palette.text.secondary,
  textTransform: "uppercase",
  fontWeight: "normal",
  margin: 0,
  display: "flex",
  flexDirection: "unset",
  justifyContent: "unset",
  gap: "12px",
  alignItems: "center",
  "& > *": { flexShrink: 0 },
}));

export default SectionTitle;
