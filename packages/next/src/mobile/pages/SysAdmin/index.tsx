import { Stack } from "@mui/material";
import PageLayout from "../../components/PageLayout";
import PageTile from "../../components/PageTitle";
import Server from "../../../components/Server";
import AppManager from "../../../components/AppManager";
import Batteries from "../../../components/Batteries";
import HACSUpdates from "../../../components/HACSUpdates";
import HomeControlSystemCard from "../../../components/HomeControlSystemCard";

export default function SysAdmin() {
  return (
    <PageLayout header={<PageTile>Sistema</PageTile>}>
      <Stack spacing={5}>
        <HomeControlSystemCard />
        <Server />
        <Batteries />
        <HACSUpdates />
        <AppManager />
      </Stack>
    </PageLayout>
  );
}
