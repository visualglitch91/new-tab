import { Box, Grid, Stack, useMediaQuery } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { TickTickData } from "@home-control/types/ticktick";
import api from "../../utils/api";
import Tasks from "../../components/Tasks";
import Bookmarks from "../../components/Bookmarks";
import Habits from "../../components/Habits";
import Forecast from "../../components/Forecast";
import MediaCard from "../../components/MediaCard";
import PackageTracker, {
  usePackageTrackerMenu,
} from "../../components/PackageTracker";
import Section from "../../components/Section";
import Icon from "../../components/Icon";
import AltIconButton from "../../components/AltIconButton";
import useTickTickData from "../../utils/useTickTickData";

const bookmarks = <Bookmarks />;
const mediaCard = <MediaCard />;

export default function DashboardPage() {
  const sm = useMediaQuery("@media(max-width: 1000px)");
  const md = useMediaQuery("@media(max-width: 1500px)");
  const lg = useMediaQuery("@media(max-width: 2100px)");

  const tickTick = useTickTickData();
  const showPackageTrackerMenu = usePackageTrackerMenu();

  const habits = <Habits />;

  const packageTracker = (
    <Section
      title="Encomendas"
      button={
        <AltIconButton onClick={showPackageTrackerMenu}>
          <Icon icon="dots-vertical" size={20} />
        </AltIconButton>
      }
    >
      <PackageTracker />
    </Section>
  );

  const todayTasks = (
    <Tasks title="Hoje" items={[...tickTick.delayed, ...tickTick.today]} />
  );

  const tomorrowTasks = <Tasks title="Amanhã" items={tickTick.tomorrow} />;

  const unscheduled = <Tasks title="Sem data" items={tickTick.unscheduled} />;

  if (sm) {
    return (
      <Stack spacing={5}>
        <Box width="100%">{mediaCard}</Box>
        <Forecast days={5} sx={{ width: "100%" }} />
        {bookmarks}
        {habits}
        {todayTasks}
        {tomorrowTasks}
        {unscheduled}
        {packageTracker}
      </Stack>
    );
  }

  if (md) {
    return (
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Stack direction="row" spacing={5}>
            <Box sx={{ width: "600px" }}>{mediaCard}</Box>
            <Forecast days={3} sx={{ width: "100%" }} />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={5}>
            {bookmarks}
            {habits}
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack spacing={5}>
            {todayTasks}
            {tomorrowTasks}
            {unscheduled}
          </Stack>
        </Grid>
        <Grid item xs={6}>
          {packageTracker}
        </Grid>
      </Grid>
    );
  }

  if (lg) {
    return (
      <Stack direction="row" spacing={5}>
        <Stack spacing={5} width="33%">
          {mediaCard}
          {packageTracker}
        </Stack>
        <Stack sx={{ width: "67%" }} spacing={5}>
          <Forecast days={5} />
          {bookmarks}
          <Stack direction="row" spacing={5} sx={{ "& > *": { flex: 1 } }}>
            <Stack spacing={5}>
              {todayTasks}
              {tomorrowTasks}
            </Stack>
            <Stack spacing={5}>
              {habits}
              {unscheduled}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack direction="row" spacing={5}>
      <Stack width="25%" spacing={5}>
        {mediaCard}
        {packageTracker}
      </Stack>
      <Stack width="45%" spacing={5}>
        <Forecast days={5} />
        {bookmarks}
        <Stack direction="row" spacing={5} sx={{ "& > *": { flex: 1 } }}>
          {habits}
        </Stack>
      </Stack>
      <Stack spacing={5} flex={1}>
        {todayTasks}
        {tomorrowTasks}
        {unscheduled}
      </Stack>
    </Stack>
  );
}
