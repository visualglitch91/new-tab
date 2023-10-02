import { styled } from "@mui/joy";
import { alpha } from "../utils/styles";

const StickMobileHeader = styled("div")({
  position: "sticky",
  top: 0,
  zIndex: 10,
  margin: -16,
  padding: 16,
  "&:after": {
    zIndex: 1,
    content: '" "',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    transition: "opacity 170ms linear",
    backdropFilter: "blur(10px)",
    backgroundImage: `linear-gradient(
      to top,
      ${alpha("#242e42", 0.7)} 0%,
      ${alpha("#242e42", 0.7)} 34%,
      #242e42 100%
    )`,
    '[data-scrolled="true"] &': { opacity: 1 },
  },
});

export default StickMobileHeader;
