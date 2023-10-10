import { useState } from "react";
import { Stack, TextField, Button } from "@mui/material";
import { SimpleAction } from "@home-control/types/hass-scheduler";
import DialogBase, { DialogBaseControlProps } from "../DialogBase";
import ActionsForm from "../ActionsForm";
import api from "../../utils/api";
import { queryClient } from "../../utils/queryClient";

export default function NewTimerDialog({
  defaultName,
  ...props
}: {
  defaultName: string;
} & DialogBaseControlProps) {
  const [name, setName] = useState(defaultName);
  const [until, setUntil] = useState<string>("");
  const [duration, setDuration] = useState(0);
  const [timerType, setTimerType] = useState<"duration" | "until">("duration");
  const [actions, setActions] = useState<SimpleAction[]>([]);

  function onSave() {
    const parsedActions = actions
      .filter((it) => !!it.entityId)
      .map((it) => ({
        domain: "homeassistant",
        service: it.on ? "turn_on" : "turn_off",
        data: { entity_id: it.entityId },
      }));

    api(
      "/hass-scheduler/timers",
      "post",
      timerType === "duration"
        ? { name, duration, actions: parsedActions }
        : { name, until: new Date(until).toISOString(), actions: parsedActions }
    )
      .then(() => queryClient.invalidateQueries(["timers"]))
      .then(() => props.onClose());
  }

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
          <Button onClick={() => onSave()}>Confirmar</Button>
        </>
      }
    >
      <Stack gap={2}>
        <TextField
          sx={{ flex: 1 }}
          label="Name"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
        />
        <Stack direction="row" gap={2}>
          <TextField
            select
            SelectProps={{ native: true }}
            value={timerType}
            label="Tipo"
            onChange={(e) => {
              setTimerType(e.currentTarget.value as typeof timerType);
            }}
          >
            <option value="duration">Duraçao</option>
            <option value="until">Data Fixa</option>
          </TextField>
          {timerType === "duration" ? (
            <TextField
              sx={{ flex: 1 }}
              label="Segundos"
              type="number"
              value={duration}
              onChange={(event) => {
                setDuration(Number(event.currentTarget.value));
              }}
            />
          ) : (
            <TextField
              sx={{ flex: 1 }}
              label="Data Fixa"
              type="datetime-local"
              value={until}
              InputLabelProps={{ shrink: true }}
              onChange={(event) => {
                setUntil(event.currentTarget.value);
              }}
            />
          )}
        </Stack>
        <ActionsForm value={actions} onChange={setActions} />
      </Stack>
    </DialogBase>
  );
}
