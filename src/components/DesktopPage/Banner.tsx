import { styled } from "@mui/material";
import { PaletteColors } from "$app/theme/palette";
import { getAssetUrl } from "$app/assets";

const Banner = styled("div")<{
  src: string;
  label: string;
  color: PaletteColors;
}>(({ theme, src, label, color }) => ({
  height: "100%",
  width: 300,
  [theme.breakpoints.down("lg")]: { width: 250 },
  [theme.breakpoints.down("md")]: { display: "none" },
  flexShrink: 0,
  backgroundImage: `url(${getAssetUrl(`banners/${src}`)})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&::after": {
    content: `"${label}"`,
    position: "absolute",
    display: "flex",
    textTransform: "uppercase",
    overflowWrap: "break-word",
    width: "25px",
    padding: 52,
    fontSize: 30,
    [theme.breakpoints.down("lg")]: { padding: 38, fontSize: 26 },
    "@media (max-height: 1080px)": { padding: 38, fontSize: 24 },
    borderRadius: "5px",
    boxShadow: `inset 0 0 0 2px ${theme.palette[color].main}`,
    background: "linear-gradient(to top, rgba(50, 48, 47, 0.9), transparent)",
    color: theme.palette[color].main,
    letterSpacing: "1px",
    textAlign: "center",
    flexWrap: "wrap",
    wordBreak: "break-all",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(3px)",
  },
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

export default Banner;
