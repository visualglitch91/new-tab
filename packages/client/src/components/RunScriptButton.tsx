import PillButton from "./PillButton";
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
    <PillButton
      className={className}
      onClick={makeTurnOnCall(entityId)}
      label={label}
    />
  );
}
