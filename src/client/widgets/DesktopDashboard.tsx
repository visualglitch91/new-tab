import { useQuery } from "@tanstack/react-query";
import { TickTickData } from "../../types/ticktick";
import api from "../utils/api";
import Stack from "../components/Stack";
import Habits from "../components/Habits";
import Tasks from "../components/Tasks";
import Links from "../components/Links";
import ClockAndWeather from "../components/ClockAndWeather";
import Forecast from "../components/Forecast";
import { useMediaQuery } from "../utils/general";
import MediaCard from "../components/MediaCard";
import PackageTracker from "./PackageTracker";

const clock = <ClockAndWeather />;
const links = <Links />;
const mediaCard = <MediaCard />;
const packageTracker = <PackageTracker />;

export default function DesktopDashboard() {
  const { data, refetch } = useQuery(["ticktick"], () =>
    api<TickTickData>("/ticktick/data", "GET")
  );

  const sm = useMediaQuery("@media(max-width: 1100px)");

  const habits = <Habits items={data?.habits || []} requestRefresh={refetch} />;

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
      <Stack>
        <Stack horizontal>
          {clock}
          <Forecast days={3} />
        </Stack>
        <Stack horizontal>
          {habits}
          <Stack>
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
    <Stack horizontal>
      <Stack
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
      <Stack sx={{ width: "67%" }}>
        <Forecast days={5} />
        {links}
        <Stack horizontal>
          {next}
          {unscheduled}
        </Stack>
      </Stack>
    </Stack>
  );
}
