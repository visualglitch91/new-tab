import { Stack, useMediaQuery } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { TickTickData } from "@home-control/types/ticktick";
import api from "../utils/api";
import Tasks from "../components/Tasks";
import Links from "../components/Links";
import Habits from "../components/Habits";
import Forecast from "../components/Forecast";
import MediaCard from "../components/MediaCard";
import PackageTracker, { useAddPackage } from "../components/PackageTracker";
import ClockAndWeather from "../components/ClockAndWeather";
import Section from "../components/Section";
import Icon from "../components/Icon";
import AltIconButton from "../components/AltIconButton";

const links = <Links />;
const mediaCard = <MediaCard />;
const clock = <ClockAndWeather />;

export default function DesktopDashboard() {
  const addPackage = useAddPackage();
  const sm = useMediaQuery("@media(max-width: 1100px)");
  const { data, refetch } = useQuery(["ticktick"], () =>
    api<TickTickData>("/ticktick/data", "GET")
  );

  const habits = <Habits items={data?.habits || []} requestRefresh={refetch} />;

  const packageTracker = (
    <Section
      title="Encomendas"
      button={
        <AltIconButton onClick={addPackage}>
          <Icon icon="plus" size={20} />
        </AltIconButton>
      }
    >
      <PackageTracker />
    </Section>
  );

  const next = (
    <Tasks
      title="Hoje e Próximas"
      items={data?.scheduled || []}
      requestRefresh={refetch}
    />
  );

  const unscheduled = (
    <Tasks
      title="Sem data"
      items={data?.unscheduled || []}
      requestRefresh={refetch}
    />
  );

  if (sm) {
    return (
      <Stack spacing={5}>
        <Stack direction="row" spacing={5}>
          {clock}
          <Forecast days={3} />
        </Stack>
        <Stack direction="row" spacing={5}>
          {habits}
          <Stack spacing={5}>
            {next}
            {unscheduled}
            {mediaCard}
          </Stack>
        </Stack>
        {links}
        {packageTracker}
      </Stack>
    );
  }

  return (
    <Stack direction="row" spacing={5}>
      <Stack
        spacing={5}
        sx={{
          minWidth: "33%",
          maxWidth: "33%",
        }}
      >
        {clock}
        {mediaCard}
        {habits}
        {packageTracker}
      </Stack>
      <Stack sx={{ width: "67%" }} spacing={5}>
        <Forecast days={5} />
        {links}
        <Stack direction="row" spacing={5} sx={{ "& > *": { flex: 1 } }}>
          {next}
          {unscheduled}
        </Stack>
      </Stack>
    </Stack>
  );
}
