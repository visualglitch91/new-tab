import { styled } from "@mui/material";
import { getConfig } from "../utils/useConfig";
import GlossyPaper from "./GlossyPaper";

const hasCustomWallpaper = !!getConfig("wallpaper");

const SectionTitle = styled(
  //@ts-expect-error
  hasCustomWallpaper ? GlossyPaper.withComponent("h2") : "h2"
)({
  fontSize: hasCustomWallpaper ? 24 : 28,
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
  padding: hasCustomWallpaper ? "8px 16px" : undefined,
});

export default SectionTitle;
