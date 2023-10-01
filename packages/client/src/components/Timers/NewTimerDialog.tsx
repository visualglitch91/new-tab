import { useState } from "react";
import { Input, FormLabel, FormControl } from "@mui/joy";
import { Actions, SimpleAction } from "@home-control/types/hass-scheduler";
import { focusOnRef } from "../../utils/react";
import DialogBase from "../DialogBase";
import Stack from "../Stack";
import BorderButton from "../BorderButton";
import ActionsForm from "../ActionsForm";

export default function NewTimerDialog({
  defaultName,
  onSave,
  onClose,
}: {
  defaultName: string;
  onSave: (name: string, duration: number, actions: Actions) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(defaultName);
  const [duration, setDuration] = useState(0);
  const [actions, setActions] = useState<SimpleAction[]>([]);

  return (
    <DialogBase
      title="Novo Timer"
      sx={(theme) => ({
        [theme.breakpoints.up("sm")]: {
          width: "80vw",
          maxWidth: "600px",
        },
      })}
      onClose={onClose}
    >
      <Stack>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Segundos</FormLabel>
          <Input
            type="number"
            slotProps={{ input: { ref: focusOnRef } }}
            value={duration}
            onChange={(event) => setDuration(Number(event.currentTarget.value))}
          />
        </FormControl>
        <ActionsForm value={actions} onChange={setActions} />
        <BorderButton
          primary
          onClick={() =>
            onSave(
              name,
              duration,
              actions
                .filter((it) => !!it.entityId)
                .map((it) => ({
                  domain: "homeassistant",
                  service: it.on ? "turn_on" : "turn_off",
                  data: { entity_id: it.entityId },
                }))
            )
          }
        >
          Confirmar
        </BorderButton>
      </Stack>
    </DialogBase>
  );
}
