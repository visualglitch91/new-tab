import { Stack } from "@mui/material";
import { isAndroidLauncher } from "../../utils/general";
import ClockAndWeather from "../../components/ClockAndWeather";
import Forecast from "../../components/Forecast";
import useTickTickData from "../../utils/useTickTickData";
import AndroidFavoriteApps from "../../components/AndroidFavoriteApps";
import Tasks from "../../components/Tasks";
import Habits from "../../components/Habits";
import { SxProps } from "../../theme/utils";

const taskCustomSx: SxProps = {
  "& .MuiListItem-root": { minHeight: 0, py: "2px" },
  "& .MuiListItemText-primary": { fontSize: 14 },
  "& .TaskItem-timeSlot": { fontSize: 10, padding: "2px 6px", fontWeight: 600 },
};

const habitsCustomSx: SxProps = {
  "& .HabitItem-root": { fontSize: 12, padding: "9px 12px" },
  "& .DraculaChip-root": { fontSize: 11, padding: "2px 6px" },
  "& .DotLoading-root": { "--size": "6px" },
};

export default function MobileDashboardPage() {
  const tickTick = useTickTickData();

  return (
    <Stack margin="16px" spacing={3.2} data-small-section-titles="true">
      <ClockAndWeather />
      <Forecast days={3} />
      {isAndroidLauncher && <AndroidFavoriteApps />}
      <Habits sx={habitsCustomSx} columnWidth={140} />
      <Tasks
        sx={taskCustomSx}
        title="Hoje"
        items={[...tickTick.delayed, ...tickTick.today]}
      />
      <Tasks sx={taskCustomSx} title="Amanhã" items={tickTick.tomorrow} />
      <Tasks sx={taskCustomSx} title="Sem data" items={tickTick.unscheduled} />
    </Stack>
  );
}
