import { useState } from "react";
import InputMask from "react-input-mask";
import { Button, Stack, TextField } from "@mui/material";
import { Schedule, SimpleAction } from "$common/types/hass-scheduler";
import DialogBase, { DialogBaseControlProps } from "../DialogBase";
import ActionsForm from "../ActionsForm";
import DaysRow from "../DaysRow";
import { formatTime } from "./utils";

export default function ScheduleDialog({
  initialValues,
  onSave,
  ...props
}: {
  initialValues: Partial<Schedule>;
  onSave: (value: Omit<Schedule, "id" | "enabled"> & { id?: string }) => void;
} & DialogBaseControlProps) {
  const [name, setName] = useState(initialValues.name || "");
  const [days, setDays] = useState(initialValues.days || {});

  const [time, setTime] = useState(
    initialValues.time ? formatTime(initialValues.time) : ""
  );

  const [actions, setActions] = useState<SimpleAction[]>(() => {
    return (initialValues.actions || []).map((it) => ({
      on: it.service === "turn_on",
      entityId: it.data?.entity_id,
    }));
  });

  const isValidTime = /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

  return (
    <DialogBase
      {...props}
      title={
        initialValues?.id
          ? `Editar "${initialValues.name}"`
          : "Novo Agendamento"
      }
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
            variant="contained"
            disabled={!isValidTime}
            onClick={() => {
              const [hour, minute] = time.split(":").map(Number);

              onSave({
                ...initialValues,
                id: initialValues.id,
                name,
                days,
                time: { hour, minute },
                actions: actions
                  .filter((it) => !!it.entityId)
                  .map((it) => ({
                    domain: "homeassistant",
                    service: it.on ? "turn_on" : "turn_off",
                    data: { entity_id: it.entityId },
                  })),
              });
            }}
          >
            Confirmar
          </Button>
        </>
      }
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
          />
          <InputMask
            id="time"
            mask={[/[0-2]/, /[0-9]/, ":", /[0-5]/, /[0-9]/]}
            placeholder="HH:MM"
            value={time}
            onChange={(e) => setTime(e.currentTarget.value)}
          >
            <TextField sx={{ minWidth: "120px" }} label="Horário" />
          </InputMask>
        </Stack>
        <DaysRow value={days} onChange={setDays} />
        <ActionsForm value={actions} onChange={setActions} />
      </Stack>
    </DialogBase>
  );
}
