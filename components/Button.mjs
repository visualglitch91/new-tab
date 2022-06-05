import { h,  } from "../utils/preact.mjs";
import { clsx, css } from "../utils/general.mjs";

css(`
  .component__button {}
`);

export default function Button({ class: className, children, onClick }) {
  return h`
    <button type="button" class=${clsx(
      "component__button",
      className
    )} onClick=${onClick}>
      ${children}
    </button>
  `;
}
