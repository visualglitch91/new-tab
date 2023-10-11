import { Link } from "wouter";
import { Button, Stack } from "@mui/material";
import { SxProps } from "../../theme/utils";
import { isAndroidLauncher } from "../../utils/general";
import useTickTickData from "../../utils/useTickTickData";
import ClockAndWeather from "../../components/ClockAndWeather";
import Forecast from "../../components/Forecast";
import AndroidFavoriteApps from "../../components/AndroidFavoriteApps";
import Tasks from "../../components/Tasks";
import Habits from "../../components/Habits";
import GlossyPaper from "../../components/GlossyPaper";
import Grid from "../../components/Grid";
import Icon from "../../components/Icon";

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

function AppLink({
  icon,
  label,
  path,
}: {
  icon: string;
  label: string;
  path: string;
}) {
  return (
    <Link to={path}>
      <Button
        fullWidth
        size="small"
        color="white"
        variant="text"
        sx={{
          py: "6px",
          textTransform: "none",
          background: "rgba(10,10,10,0.3)",
          "&:hover": { background: "rgba(0,0,0,0.35)" },
        }}
        startIcon={<Icon icon={icon} />}
      >
        {label}
      </Button>
    </Link>
  );
}

export default function MobileDashboardPage() {
  const tickTick = useTickTickData();

  return (
    <Stack margin="16px" spacing={3.2} data-small-section-titles="true">
      <ClockAndWeather />
      <Forecast days={3} />
      {isAndroidLauncher && (
        <>
          <AndroidFavoriteApps />
          <GlossyPaper sx={{ padding: "12px" }}>
            <Grid gap={12} columnWidth={100} rowHeight={0}>
              <AppLink path="/apps" icon="apps" label="Apps" />
              <AppLink path="/tv" icon="television" label="TV" />
              <AppLink path="/home" icon="home-outline" label="Casa" />
            </Grid>
          </GlossyPaper>
        </>
      )}
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
