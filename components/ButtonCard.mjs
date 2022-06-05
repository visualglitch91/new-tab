import { h } from "../utils/preact.mjs";
import { css, clsx } from "../utils/general.mjs";
import Paper from "./Paper.mjs";

css(`
  .component__button-card {
    overflow: hidden;
  }

  .component__button-card > button {
    height: 100%;
    margin: 0;
    padding: 6px;
    border: none;
    outline: none;
    background: transparent;
    font-size: 17px;
    color:inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 100ms linear;
  }

  .component__button-card > button:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`);

export default function ButtonCard({
  class: className,
  children,
  onClick,
}) {
  return h`
    <${Paper} class=${clsx("component__button-card", className)}>
      <button type="button" onClick=${onClick}>
        ${children}
      </button>
    </${Paper}>`;
}
