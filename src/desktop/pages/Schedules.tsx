import useUpsertSchedule from "$app/components/Schedules/useUpsertSchedule";
import Schedules from "$app/components/Schedules";
import DesktopButton from "../DesktopButton";
import { Stack } from "@mui/material";

export default function SchedulesPage() {
  const upsertSchedule = useUpsertSchedule();

  return (
    <Stack gap={1}>
      <DesktopButton
        sx={{ alignSelf: "flex-end" }}
        icon="plus"
        onClick={() => upsertSchedule()}
      >
        Adicionar
      </DesktopButton>
      <Schedules />
    </Stack>
  );
}
