import rawTheme from "../theme";
import { darken, lighten } from "./utils";

export { css, appendStyle, keyframes } from "./css";
export { styled } from "./styled";
export * from "./utils";

function createPallete(base: string) {
  return {
    l120: lighten(base, 1.2),
    l90: lighten(base, 0.9),
    l60: lighten(base, 0.6),
    l30: lighten(base, 0.3),
    l10: lighten(base, 0.1),
    base,
    d10: darken(base, 0.1),
    d30: darken(base, 0.3),
    d60: darken(base, 0.6),
    d90: darken(base, 0.9),
    d120: darken(base, 1.2),
  };
}

export const theme = {
  ...rawTheme,
  accent: createPallete(rawTheme.accent),
  background: createPallete(rawTheme.background),
};
