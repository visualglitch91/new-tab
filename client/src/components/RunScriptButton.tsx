import { Button, ButtonProps } from "@mui/material";
import { callService, useEntity } from "$client/utils/hass";
import useAsyncChange from "$client/utils/useAsyncChange";
import DotLoading from "./DotLoading";

export default function RunScriptButton({
  entityId,
  ...props
}: {
  entityId: string;
} & Omit<ButtonProps, "onClick">) {
  const entity = useEntity(entityId);

  const { changing, change } = useAsyncChange({
    flag: entity?.state === "on" || false,
    timeout: 30_000,
  });

  if (changing) {
    return <DotLoading />;
  }

  return (
    <Button
      {...props}
      onClick={() => {
        if (change()) {
          callService("homeassistant", "turn_on", { entity_id: entityId });
        }
      }}
    />
  );
}
