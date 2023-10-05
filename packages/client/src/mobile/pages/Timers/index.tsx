import TabLayout from "../../components/TabLayout";
import Timers from "./Timers";
import Schedule from "./Schedule";
import RouteRedirect from "../../../components/RouteRedirect";

export default function TimersAndSchedule() {
  return (
    <>
      <RouteRedirect from="/timers" to="/timers/timers" />
      <TabLayout
        tabs={[
          {
            label: "Timers",
            icon: "clock-outline",
            path: "/timers/timers",
            component: <Timers />,
          },
          {
            label: "Agendamentos",
            icon: "calendar-outline",
            path: "/timers/schedule",
            admin: true,
            component: <Schedule />,
          },
        ]}
      />
    </>
  );
}
