import { styled, css, uniqueClassName, theme } from "../../styling";
import Button from "../Button";
import ColorPresets from "../ColorPresets";

export const Content = styled(
  "div",
  css`
    width: 320px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 24px;
  `
);

export const StyledColorPresets = styled(
  ColorPresets,
  css`
    margin: 0 auto;
    grid-gap: 12px;
  `
);

export const Tabs = styled(
  "div",
  css`
    display: flex;
    width: 100%;
  `
);

export const classes = { tabActive: uniqueClassName() };

export const Tab = styled(
  Button,
  css`
    border: 1px solid ${theme.accent.base};
    border-radius: 0;
    flex: 1;
    padding: 8px;
    border-right-width: 0;

    &:first-child {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    &:last-child {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      border-right-width: 1px;
    }

    &.${classes.tabActive} {
      background: ${theme.accent.base} !important;
      color: #24324b !important;
    }
  `
);
