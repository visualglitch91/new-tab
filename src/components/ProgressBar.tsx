import { css, styled, theme } from "../styling";

const Root = styled(
  "div",
  css`
    height: 6px;
    width: 100%;
    border-radius: 4px;
    position: relative;
    background: ${theme.background.base};
    overflow: hidden;
  `
);

const Bar = styled(
  "div",
  css`
    height: 24px;
    width: 0%;
    background: ${theme.accent.base};
    position: absolute;
    top: 0;
    left: 0;
  `
);

export default function ProgressBar({ value = 0 }: { value: number }) {
  return (
    <Root>
      <Bar style={{ width: `${value}%` }} />
    </Root>
  );
}
