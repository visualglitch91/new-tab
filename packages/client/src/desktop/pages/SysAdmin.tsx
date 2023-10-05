import ServerModule from "../../components/Server";
import Batteries from "../../components/Batteries";
import HACSUpdates from "../../components/HACSUpdates";
import HomeControlCard from "../../components/HomeControlCard";
import AppManager from "../../components/AppManager";
import MasonryLayout from "../components/DesktopLayout/MasonryLayout";
import { useIsAdmin } from "../../utils/hass";

export default function SysAdminPage() {
  const isAdmin = useIsAdmin();

  return (
    <MasonryLayout
      items={[
        <HomeControlCard />,
        ...(isAdmin ? [<ServerModule />, <AppManager />, <HACSUpdates />] : []),
        <Batteries />,
      ]}
    />
  );
}
