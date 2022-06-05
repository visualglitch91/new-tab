import { h } from "../utils/preact.mjs";
import { css } from "../utils/general.mjs";
import Button from "./Button.mjs";
import { makeTurnOnCall } from "../utils/hass.mjs";

css(`
  .component__paper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: rgba(47,59,82,0.6);
    backdrop-filter: blur(10px);
    box-shadow rgb(17, 35, 52) 3px 3px 13px -6px;
    border-radius: 5px;
  }
`);

export default function RunScriptButton({
  class: className,
  label = "Executar",
  entityId,
}) {
  return h`
    <${Button} class=${className} onClick=${makeTurnOnCall(entityId)}>
      ${label}
    </${Button}>
  `;
}
