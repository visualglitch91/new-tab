import { styled, css, theme } from "../styling";
import RippleButton from "./RippleButton";

const Button = styled(
  RippleButton,
  css`
    height: 100%;
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: ${theme.accent.base};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 60ms linear, box-shadow 60ms linear;
    font-weight: bolder;
    text-transform: uppercase;
    padding: 6px 8px;
    border-radius: 4px;

    &.hover {
      background: rgba(0, 0, 0, 0.1);
    }
  `
);

export default Button;
