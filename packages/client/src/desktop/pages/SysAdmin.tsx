import ServerModule from "../../components/Server";
import Batteries from "../../components/Batteries";
import HACSUpdates from "../../components/HACSUpdates";
import HomeControlSystemCard from "../../components/HomeControlSystemCard";
import AppManager from "../../components/AppManager";
import MasonryLayout from "../components/DesktopLayout/MasonryLayout";

export default function SysAdminPage() {
  return (
    <MasonryLayout
      items={[
        <ServerModule />,
        <Batteries />,
        <HACSUpdates />,
        <HomeControlSystemCard />,
        <AppManager />,
      ]}
    />
  );
}
