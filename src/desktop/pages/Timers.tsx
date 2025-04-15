import { Stack } from "@mui/material";
import Timers from "$app/components/Timers";
import useAddTimer from "$app/components/Timers/useAddTimer";
import DesktopButton from "../DesktopButton";

export default function TimersPage() {
  const addTimer = useAddTimer();

  return (
    <Stack gap={1}>
      <DesktopButton
        sx={{ alignSelf: "flex-end" }}
        icon="plus"
        onClick={() => addTimer()}
      >
        Adicionar
      </DesktopButton>
      <Timers />
    </Stack>
  );
}
