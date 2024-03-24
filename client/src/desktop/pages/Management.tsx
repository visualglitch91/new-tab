import ServerModule from "$client/components/Server";
import Batteries from "$client/components/Batteries";
import HACSUpdates from "$client/components/HACSUpdates";
import HomeControlCard from "$client/components/HomeControlCard";
import MasonryLayout from "$client/desktop/components/DesktopLayout/MasonryLayout";

export default function ManagementPage() {
  return (
    <MasonryLayout
      items={[
        <HomeControlCard />,
        <ServerModule />,
        <HACSUpdates />,
        <Batteries />,
      ]}
    />
  );
}
