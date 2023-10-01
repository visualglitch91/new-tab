import { useState } from "react";
import InputMask from "react-input-mask";
import { Input, FormLabel, FormControl } from "@mui/joy";
import { Schedule, SimpleAction } from "@home-control/types/hass-scheduler";
import DialogBase from "../DialogBase";
import Stack from "../Stack";
import BorderButton from "../BorderButton";
import ActionsForm from "../ActionsForm";
import FlexRow from "../FlexRow";
import DaysRow from "./DaysRow";
import { formatTime } from "./utils";

export default function NewScheduleDialog({
  initialValues,
  onSave,
  onClose,
}: {
  initialValues: Partial<Schedule>;
  onSave: (value: Omit<Schedule, "id" | "enabled"> & { id?: string }) => void;
  onClose: () => void;
}) {
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
      title="Novo Timer"
      sx={(theme) => ({
        [theme.breakpoints.up("sm")]: {
          width: "80vw",
          maxWidth: "500px",
        },
      })}
      onClose={onClose}
    >
      <Stack>
        <FlexRow full>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel>Name</FormLabel>
            <Input
              value={name}
              onChange={(event) => setName(event.currentTarget.value)}
            />
          </FormControl>
          <FormControl sx={{ width: "85px" }}>
            <FormLabel>Horário</FormLabel>
            <InputMask
              id="time"
              mask={[/[0-2]/, /[0-9]/, ":", /[0-5]/, /[0-9]/]}
              placeholder="HH:MM"
              value={time}
              onChange={(e) => setTime(e.currentTarget.value)}
            >
              <Input />
            </InputMask>
          </FormControl>
        </FlexRow>
        <DaysRow buttonFlex={1} value={days} onChange={setDays} />
        <ActionsForm value={actions} onChange={setActions} />
        <BorderButton
          primary
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
        </BorderButton>
      </Stack>
    </DialogBase>
  );
}
