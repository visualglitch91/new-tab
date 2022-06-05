import { h } from "../utils/preact.mjs";
import Button from "./Button.mjs";
import { makeTurnOnCall } from "../utils/hass.mjs";

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
