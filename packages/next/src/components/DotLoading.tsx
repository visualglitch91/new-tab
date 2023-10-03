import { alpha, keyframes, styled } from "@mui/material";

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
  "--Color1": theme.palette.primary.main,
  "--Color2": alpha(theme.palette.primary.main, 0.2),

  "& > div": {
    position: "relative",
    width: "10px",
    height: "10px",
    borderRadius: "5px",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    animation: `${animation} 1s infinite linear alternate`,
    animationDelay: "0.5s",

    "&::before": {
      left: "-15px",
      width: "10px",
      height: "10px",
      borderRadius: "5px",
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
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
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
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
