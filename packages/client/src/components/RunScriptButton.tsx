import { Button, ButtonProps } from "@mui/material";
import { makeTurnOnCall } from "../utils/hass";

export default function RunScriptButton({
  entityId,
  ...props
}: {
  entityId: string;
} & Omit<ButtonProps, "onClick">) {
  return <Button {...props} onClick={makeTurnOnCall(entityId)} />;
}
