import { styled } from "@mui/joy";
import { keyframes } from "@emotion/react";
import { alpha } from "../utils/styles";

const animation = keyframes`
  0% {
    background-color: var(--Color1);
  }
  
  50%,
  100% {
    background-color: var(--Color2);
  }
`;

const Wrapper = styled("div")(({ theme }) => ({
  width: "40px",
  display: "inline-flex",
  justifyContent: "center",
  "--Color1": theme.palette.primary[400],
  "--Color2": alpha(theme.palette.primary[400], 0.2),

  "& > div": {
    position: "relative",
    width: "10px",
    height: "10px",
    borderRadius: "5px",
    backgroundColor: theme.palette.primary[400],
    color: theme.palette.primary[400],
    animation: `${animation} 1s infinite linear alternate`,
    animationDelay: "0.5s",

    "&::before": {
      left: "-15px",
      width: "10px",
      height: "10px",
      borderRadius: "5px",
      backgroundColor: theme.palette.primary[400],
      color: theme.palette.primary[400],
      animation: `${animation} 1s infinite alternate`,
      animationDelay: "0s",
    },

    "&::before, &::after": {
      content: `""`,
      display: "inline-block",
      position: "absolute",
      top: "0px",
    },

    "&::after": {
      left: "15px",
      width: "10px",
      height: "10px",
      borderRadius: "5px",
      backgroundColor: theme.palette.primary[400],
      color: theme.palette.primary[400],
      animation: `${animation} 1s infinite alternate`,
      animationDelay: "1s",
    },
  },
}));

export default function DotLoading() {
  return (
    <Wrapper>
      <div />
    </Wrapper>
  );
}
