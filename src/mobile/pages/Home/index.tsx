import RouteRedirect from "$app/components/RouteRedirect";
import TabLayout from "$app/mobile/components/TabLayout";
import Devices from "./Devices";
import Vacuum from "./Vacuum";

export default function Home() {
  return (
    <>
      <RouteRedirect from="/mobile/home" to="/mobile/home/devices" />
      <TabLayout
        tabs={[
          {
            label: "Casa",
            icon: "home",
            path: "/mobile/home/devices",
            component: <Devices />,
          },
          {
            label: "Aspirador",
            icon: "robot-vacuum",
            path: "/mobile/home/vacuum",
            component: <Vacuum />,
          },
        ]}
      />
    </>
  );
}
