import { styled, keyframes, css, theme, alpha } from "../styling";

const animation = keyframes`
  0% {
    background-color: ${theme.accent.base};
  }
  50%,
  100% {
    background-color: ${alpha(theme.accent.base, 0.2)};
  }
`;

const Wrapper = styled(
  "div",
  css`
    width: 40px;
    display: inline-flex;
    justify-content: center;

    & > div {
      position: relative;
      width: 10px;
      height: 10px;
      border-radius: 5px;
      background-color: ${theme.accent.base};
      color: ${theme.accent.base};
      animation: ${animation} 1s infinite linear alternate;
      animation-delay: 0.5s;

      &::before {
        left: -15px;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        background-color: ${theme.accent.base};
        color: ${theme.accent.base};
        animation: ${animation} 1s infinite alternate;
        animation-delay: 0s;
      }

      &::before,
      &::after {
        content: "";
        display: inline-block;
        position: absolute;
        top: 0;
      }

      &::after {
        left: 15px;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        background-color: ${theme.accent.base};
        color: ${theme.accent.base};
        animation: ${animation} 1s infinite alternate;
        animation-delay: 1s;
      }
    }
  `
);

export default function DotLoading() {
  return (
    <Wrapper>
      <div />
    </Wrapper>
  );
}
