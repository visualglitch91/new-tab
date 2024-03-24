import AppManager from "$client/components/AppManager";
import MasonryLayout from "$client/desktop/components/DesktopLayout/MasonryLayout";

export default function AppManagerPage() {
  return <MasonryLayout items={[<AppManager />]} />;
}
