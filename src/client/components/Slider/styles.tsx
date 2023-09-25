import { css, theme, uniqueClassName } from "../../styling";

const filled = theme.accent.base;
const trackColor = theme.background.d30;

export const thumb = uniqueClassName();

export const track = uniqueClassName();

export const root = css`
  &,
  .${thumb}, .${track} {
    height: 32px;
  }

  .${thumb}, .${track} {
    display: flex;
    align-items: center;
    justify-content: center;

    & > span {
      display: block;
    }
  }

  .${thumb} {
    width: 18px;
    outline: none;

    & > span {
      width: 18px;
      height: 18px;
      border-radius: 100%;
      background: ${filled};
    }
  }

  .${thumb}:hover {
    cursor: pointer;

    & > span {
      background: ${theme.accent.d10};
    }
  }

  .${track} > span {
    width: 100%;
    height: 4px;
    background: ${trackColor};
  }

  .${track}-0 > span {
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    background: ${filled};
  }

  .${track}-1 > span {
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
  }
`;
