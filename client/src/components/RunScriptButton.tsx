import { Button, ButtonProps } from "@mui/material";
import { makeTurnOnCall, useEntity } from "$client/utils/hass";
import DotLoading from "./DotLoading";

export default function RunScriptButton({
  entityId,
  ...props
}: {
  entityId: string;
} & Omit<ButtonProps, "onClick">) {
  const entity = useEntity(entityId);
  const running = entity?.state === "on";

  if (running) {
    return <DotLoading />;
  }

  return <Button {...props} onClick={makeTurnOnCall(entityId)} />;
}
