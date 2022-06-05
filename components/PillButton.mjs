import { h } from "../utils/preact.mjs";
import { clsx, css } from "../utils/general.mjs";
import MaterialIcon from "./MaterialIcon.mjs";

css(`
  .component__pill-button {
    height: 100%;
    margin: 0;
    padding: 6px 8px;
    border: none;
    outline: none;
    font-size: 10px;
    color: #f64270;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 60ms linear;
    border-radius: 5px;
    font-weight: bolder;
    text-transform: uppercase;
    background: rgba(0, 0, 0, 0.1);
    column-gap: 6px;
  }

  .component__pill-button:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  .component__pill-button i {
    font-size: 14px;
  }
`);

export default function PillButton({ class: className, icon, label, onClick }) {
  return h`
    <button type="button" class=${clsx(
      "component__pill-button",
      className
    )} onClick=${onClick}>
      ${icon && h`<${MaterialIcon} icon=${icon} />`}
      ${label}
    </button>
  `;
}
