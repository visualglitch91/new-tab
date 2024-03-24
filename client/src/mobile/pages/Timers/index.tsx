import RouteRedirect from "$client/components/RouteRedirect";
import TabLayout from "$client/mobile/components/TabLayout";
import Timers from "./Timers";
import Schedule from "./Schedule";

export default function TimersAndSchedule() {
  return (
    <>
      <RouteRedirect from="/mobile/timers" to="/mobile/timers/timers" />
      <TabLayout
        tabs={[
          {
            label: "Timers",
            icon: "clock-outline",
            path: "/mobile/timers/timers",
            component: <Timers />,
          },
          {
            label: "Agendamentos",
            icon: "calendar-outline",
            path: "/mobile/timers/schedule",
            admin: true,
            component: <Schedule />,
          },
        ]}
      />
    </>
  );
}
