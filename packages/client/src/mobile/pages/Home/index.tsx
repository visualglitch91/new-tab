import TabLayout from "../../components/TabLayout";
import RouteRedirect from "../../../components/RouteRedirect";
import Devices from "./Devices";
import Vacuum from "./Vacuum";
import Cameras from "./Cameras";

export default function Home() {
  return (
    <>
      <RouteRedirect from="/home" to="/home/devices" />
      <TabLayout
        tabs={[
          {
            label: "Casa",
            icon: "home",
            path: "/home/devices",
            component: <Devices />,
          },
          {
            label: "Aspirador",
            icon: "robot-vacuum",
            path: "/home/vacuum",
            component: <Vacuum />,
          },
          {
            label: "Câmeras",
            icon: "webcam",
            path: "/home/cameras",
            admin: true,
            component: <Cameras />,
          },
        ]}
      />
    </>
  );
}
