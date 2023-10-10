import { keyBy } from "lodash";
import { Stack } from "@mui/material";
import useAndroidApps from "../../utils/useAndroidApps";
import GlossyPaper from "../../components/GlossyPaper";
import LinksGrid from "../../components/LinksGrid";
import { isAndroidLauncher } from "../../utils/general";
import { config } from "../../../../../config";
import ClockAndWeather from "../../components/ClockAndWeather";
import Forecast from "../../components/Forecast";
import useTickTickData from "../../utils/useTickTickData";
import Tasks from "../../components/Tasks";
import Habits from "../../components/Habits";
import { SxProps } from "../../theme/utils";

const { favorites: favoriteApps } = config.android_launcher;

const taskCustomSx: SxProps = {
  "& .MuiListItem-root": { minHeight: 0, py: "2px" },
  "& .MuiListItemText-primary": { fontSize: 14 },
  "& .TaskItem-timeSlot": { fontSize: 10, padding: "2px 6px", fontWeight: 600 },
};

const habitsCustomSx: SxProps = {
  "& .HabitItem-root": { fontSize: 12, padding: "9px 12px" },
  "& .DraculaChip-root": { fontSize: 11, padding: "2px 6px" },
};

export default function MobileDashboardPage() {
  const androidApps = keyBy(useAndroidApps(), "name");
  const tickTick = useTickTickData();

  return (
    <Stack margin="16px" spacing={3.2} data-small-section-titles="true">
      <ClockAndWeather />
      <Forecast days={3} />
      {isAndroidLauncher && (
        <GlossyPaper>
          <LinksGrid
            gap="16px"
            sx={{ pt: "16px", pb: "12px" }}
            linkSx={{
              "--size": "58px",
              "&": { width: "var(--size) !important" },
              "& a img": {
                borderRadius: "100% !important",
                width: "var(--size) !important",
                height: "var(--size) !important",
              },
              "& a span": {
                display: "none !important",
              },
            }}
            items={favoriteApps.map((name, index) => {
              const app = androidApps[name];
              return { ...app, id: `app-index-${index}` };
            })}
          />
        </GlossyPaper>
      )}
      <Habits sx={habitsCustomSx} columnWidth={140} />
      <Tasks
        sx={taskCustomSx}
        title="Hoje"
        items={[...tickTick.data.delayed, ...tickTick.data.today]}
        requestRefetch={tickTick.refetch}
      />
      <Tasks
        sx={taskCustomSx}
        title="Amanhã"
        items={tickTick.data.tomorrow}
        requestRefetch={tickTick.refetch}
      />
      <Tasks
        sx={taskCustomSx}
        title="Sem data"
        items={tickTick.data.unscheduled}
        requestRefetch={tickTick.refetch}
      />
    </Stack>
  );
}
