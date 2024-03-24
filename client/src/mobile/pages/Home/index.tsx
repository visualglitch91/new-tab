import RouteRedirect from "$client/components/RouteRedirect";
import PageLayout from "$client/mobile/components/PageLayout";
import TabLayout from "$client/mobile/components/TabLayout";
import TV from "$client/components/TV";
import Devices from "./Devices";
import Vacuum from "./Vacuum";
import Cameras from "./Cameras";

export default function Home() {
  return (
    <>
      <RouteRedirect from="/mobile/home" to="/mobile/home/devices" />
      <TabLayout
        tabs={[
          {
            path: "/mobile/home/tv",
            icon: "television",
            label: "TV",
            component: (
              <PageLayout>
                <TV />
              </PageLayout>
            ),
          },
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
          {
            label: "Câmeras",
            icon: "webcam",
            path: "/mobile/home/cameras",
            admin: true,
            component: <Cameras />,
          },
        ]}
      />
    </>
  );
}
