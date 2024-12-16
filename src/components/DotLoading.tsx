import { alpha, keyframes, styled } from "@mui/material";
import { SxProps } from "$app/theme/utils";

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
  width: "calc(var(--size) * 3 + 15px)",
  display: "inline-flex",
  justifyContent: "center",
  "--size": "10px",
  "--Color1": theme.palette.primary.main,
  "--Color2": alpha(theme.palette.primary.main, 0.2),

  "& > div": {
    position: "relative",
    width: "var(--size)",
    height: "var(--size)",
    borderRadius: "5px",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    animation: `${animation} 1s infinite linear alternate`,
    animationDelay: "0.5s",

    "&::before": {
      left: "calc((var(--size) + 5px) * -1)",
      width: "var(--size)",
      height: "var(--size)",
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
      left: "calc(var(--size) + 5px)",
      width: "var(--size)",
      height: "var(--size)",
      borderRadius: "5px",
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
      animation: `${animation} 1s infinite alternate`,
      animationDelay: "1s",
    },
  },
}));

export default function DotLoading({ sx }: { sx?: SxProps }) {
  return (
    <Wrapper className="DotLoading-root" sx={sx}>
      <div />
    </Wrapper>
  );
}
