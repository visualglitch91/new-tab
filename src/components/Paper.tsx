import { alpha, css, styled, theme } from "../styling";

const Paper = styled(
  "div",
  css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: ${alpha(theme.background.base, 0.6)};
    backdrop-filter: blur(10px);
    box-shadow: ${theme.background.d10} 3px 3px 13px -6px;
    border-radius: 16px;
    color: white;

    body.touch-device & {
      backdrop-filter: none;
    }
  `
);

export default Paper;
