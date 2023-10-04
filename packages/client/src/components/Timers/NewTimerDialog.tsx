import { useState } from "react";
import { Stack, TextField, Button } from "@mui/material";
import { Actions, SimpleAction } from "@home-control/types/hass-scheduler";
import DialogBase, { DialogBaseControlProps } from "../DialogBase";
import ActionsForm from "../ActionsForm";

export default function NewTimerDialog({
  defaultName,
  onSave,
  ...props
}: {
  defaultName: string;
  onSave: (name: string, duration: number, actions: Actions) => void;
} & DialogBaseControlProps) {
  const [name, setName] = useState(defaultName);
  const [duration, setDuration] = useState(0);
  const [actions, setActions] = useState<SimpleAction[]>([]);

  return (
    <DialogBase
      {...props}
      title="Novo Timer"
      sx={{
        "& .MuiDialog-paper": {
          width: "90vw",
          maxWidth: "600px",
        },
      }}
      footer={
        <>
          <Button onClick={props.onClose}>Cancelar</Button>
          <Button
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
          </Button>
        </>
      }
    >
      <Stack gap={2}>
        <Stack direction="row" gap={2}>
          <TextField
            label="Name"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
          />
          <TextField
            sx={{ width: "33%" }}
            label="Segundos"
            type="number"
            value={duration}
            onChange={(event) => setDuration(Number(event.currentTarget.value))}
          />
        </Stack>
        <ActionsForm value={actions} onChange={setActions} />
      </Stack>
    </DialogBase>
  );
}
