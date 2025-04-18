import { styled } from "@mui/material";
import { PaletteColors } from "$app/theme/palette";
import { getAssetUrl } from "$app/assets";

const banners = [
  "sonic2.gif",
  "kirby.gif",
  "kero.gif",
  "sonic.gif",
  "charizard.gif",
  "mewtwo.gif",
  "power.gif",
  "inuyasha.gif",
  "pikachu.gif",
  "makima.gif",
  "sailormoon.gif",
  "shinji.gif",
  "sailormoon2.gif",
  "sailormars.gif",
  "rei.gif",
  "blackmagician.gif",
  "agumon.gif",
  "sephiroth.gif",
  "rei2.gif",
  "cloud.gif",
  "asuka.gif",
  "shadow.gif",
];

let remainingBanners = banners.slice();

export function getNextBanner() {
  if (remainingBanners.length === 0) {
    remainingBanners = banners.slice(); // Reset when empty
  }

  const index = Math.floor(Math.random() * remainingBanners.length);
  const banner = remainingBanners.splice(index, 1)[0];
  return banner;
}

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
    background:
      "linear-gradient(to top, rgba(50, 48, 47, 0.9), rgba(50, 48, 47, 0.6))",
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
