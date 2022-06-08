import Button from "./Button";
import { makeTurnOnCall } from "../utils/hass";

export default function RunScriptButton({
  class: className,
  label = "Executar",
  entityId,
}: {
  class?: string;
  label?: string;
  entityId: string;
}) {
  return (
    <Button class={className} onClick={makeTurnOnCall(entityId)}>
      {label}
    </Button>
  );
}
