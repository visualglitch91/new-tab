import ServerModule from "../../components/Server";
import Batteries from "../../components/Batteries";
import HACSUpdates from "../../components/HACSUpdates";
import HomeControlCard from "../../components/HomeControlCard";
import AppManager from "../../components/AppManager";
import MasonryLayout from "../components/DesktopLayout/MasonryLayout";

export default function SysAdminPage() {
  return (
    <MasonryLayout
      items={[
        <HomeControlCard />,
        <ServerModule />,
        <AppManager />,
        <HACSUpdates />,
        <Batteries />,
      ]}
    />
  );
}
