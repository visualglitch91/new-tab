import Button from "./Button";
import { makeTurnOnCall } from "../utils/hass";

export default function RunScriptButton({
  className,
  label = "Executar",
  entityId,
}: {
  className?: string;
  label?: string;
  entityId: string;
}) {
  return (
    <Button className={className} onTap={makeTurnOnCall(entityId)}>
      {label}
    </Button>
  );
}
