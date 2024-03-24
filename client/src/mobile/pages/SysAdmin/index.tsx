import RouteRedirect from "$client/components/RouteRedirect";
import TabLayout from "$client/mobile/components/TabLayout";
import AppManagerPage from "./AppManager";
import ManagementPage from "./Management";

export default function SysAdmin() {
  return (
    <>
      <RouteRedirect from="/mobile/admin" to="/mobile/admin/management" />
      <TabLayout
        tabs={[
          {
            label: "Administração",
            icon: "cog-outline",
            path: "/mobile/admin/management",
            component: <ManagementPage />,
          },
          {
            label: "Aplicações",
            icon: "apps",
            path: "/mobile/admin/apps",
            admin: true,
            component: <AppManagerPage />,
          },
        ]}
      />
    </>
  );
}
