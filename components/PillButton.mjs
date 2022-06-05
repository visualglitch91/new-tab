import { h } from "../utils/preact.mjs";
import {  clsx, css } from "../utils/general.mjs";
import MaterialIcon from "./MaterialIcon.mjs";

css(`
  .component__pill-button {}
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
