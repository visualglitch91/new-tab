import { styled } from "../../utils/styling";

export const Input = styled("input")`
  --height: 30px;
  --track: #20293c;
  --filled: #dc456c;
  --thumb-color: transparent;
  --thumb-width: 0;

  margin: auto;
  appearance: none;
  -webkit-appearance: none;
  position: relative;
  overflow: hidden;
  height: var(--height);
  width: 100%;
  cursor: pointer;
  border-radius: 8px;

  &::-webkit-slider-runnable-track {
    background: var(--track);
  }

  &::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    width: var(--thumb-width); /* 1 */
    height: var(--height);
    background: var(--thumb-color);
    box-shadow: -200px 0 0 200px var(--filled); /* 2 */
    border: none;
  }

  &::-moz-range-track {
    height: var(--height);
    background: var(--track);
  }

  &::-moz-range-thumb {
    background: var(--thumb-color);
    height: var(--height);
    width: var(--thumb-width);
    border: none;
    border-radius: 0 !important;
    box-shadow: -200px 0 0 200px var(--filled);
    box-sizing: border-box;
  }

  &::-ms-fill-lower {
    background: var(--filled);
  }

  &::-ms-thumb {
    background: var(--thumb-color);
    border: none;
    height: var(--height);
    width: var(--thumb-width);
    box-sizing: border-box;
  }

  &::-ms-ticks-after {
    display: none;
  }

  &::-ms-ticks-before {
    display: none;
  }

  &::-ms-track {
    background: var(--track);
    color: transparent;
    height: var(--height);
    border: none;
  }

  &::-ms-tooltip {
    display: none;
  }
`;
