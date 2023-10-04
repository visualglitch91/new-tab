import { compact } from "lodash";
import DesktopLayout from "./components/DesktopLayout";
import TV from "../components/TV";
import RecentlyRequested from "../components/MediaCenter/RecentlyRequested";
import Trending from "../components/MediaCenter/Trending";
import { Stack } from "@mui/material";
import HomeDevices from "../components/HomeDevices";
import Cameras, { useAvailableCameras } from "../components/Cameras";
import Vacuum from "../components/Vacuum";
import Timers from "../components/Timers";
import Schedules from "../components/Schedules";
import FileManager from "../components/FileManager";
import Torrents, { useAddTorrent } from "../components/Torrents";
import JDownloader, { useAddDownload } from "../components/JDownloader";
import ServerModule from "../components/Server";
import Batteries from "../components/Batteries";
import HACSUpdates from "../components/HACSUpdates";
import HomeControlSystemCard from "../components/HomeControlSystemCard";
import AppManager from "../components/AppManager";
import DesktopDashboard from "./DesktopDashboard";
import { useEntity, useUser } from "../utils/hass";
import Section from "../components/Section";
import Klipper from "../components/Klipper";
import useUpsertSchedule from "../components/Schedules/useUpsertSchedule";
import useAddTimer from "../components/Timers/useAddTimer";
import AltIconButton from "../components/AltIconButton";
import Icon from "../components/Icon";

export default function DesktopApp() {
  const isAdmin = useUser().is_admin;
  const availableEntityIds = useAvailableCameras();

  const camerasOn = availableEntityIds.length > 0;
  const printerOn = useEntity("switch.impressora_3d_servidor")?.state === "on";

  const addDownload = useAddDownload();
  const addTorrent = useAddTorrent();
  const upsertSchedule = useUpsertSchedule();
  const addTimer = useAddTimer();

  return (
    <DesktopLayout
      tabs={compact([
        isAdmin && {
          key: "desktop-dashboard",
          title: "Dashboard",
          icon: "mdi:view-dashboard-variant-outline",
          masonry: false,
          content: [<DesktopDashboard />],
        },
        {
          key: "media",
          title: "Media",
          icon: "mdi:movie-open-outline",
          content: [
            <TV />,
            <Section title="Na Fila">
              <RecentlyRequested maxHeight={550} />
            </Section>,
            <Section title="Populares">
              <Trending maxHeight={550} />
            </Section>,
          ],
        },
        {
          key: "house",
          title: "Casa",
          icon: "mdi:home",
          content: [
            <Stack spacing={4.5}>
              <HomeDevices slice={[1, 4]} />
            </Stack>,
            <Stack spacing={4.5}>
              <HomeDevices slice={[4]} />
            </Stack>,
            isAdmin && camerasOn && <Cameras />,
            isAdmin && <Vacuum />,
          ],
        },
        {
          key: "timers",
          title: "Timers",
          icon: "mdi:clock",
          content: [
            <Section
              title="Timers"
              button={
                <AltIconButton onClick={addTimer}>
                  <Icon icon="plus" size={20} />
                </AltIconButton>
              }
            >
              <Timers />
            </Section>,
            <Section
              title="Agendamentos"
              button={
                <AltIconButton onClick={upsertSchedule}>
                  <Icon icon="plus" size={20} />
                </AltIconButton>
              }
            >
              <Schedules />
            </Section>,
          ],
        },
        ...(isAdmin
          ? [
              printerOn && {
                key: "klipper",
                title: "Impressora 3D",
                icon: "mdi:printer-3d-nozzle",
                content: [<Klipper />],
              },
              {
                key: "file-manager",
                title: "Downloads",
                icon: "mdi:download",
                content: [
                  <Section title="Arquivos">
                    <FileManager maxHeight={500} />
                  </Section>,
                  <Section
                    title="Torrents"
                    button={
                      <AltIconButton onClick={addTorrent}>
                        <Icon icon="plus" size={20} />
                      </AltIconButton>
                    }
                  >
                    <Torrents maxHeight={500} />
                  </Section>,
                  <Section
                    title="JDownloader"
                    button={
                      <AltIconButton onClick={addDownload}>
                        <Icon icon="plus" size={20} />
                      </AltIconButton>
                    }
                  >
                    <JDownloader maxHeight={500} />
                  </Section>,
                ],
              },
              {
                key: "system",
                title: "Sistema",
                icon: "mdi:cpu-64-bit",
                content: [
                  <ServerModule />,
                  <Batteries />,
                  <HACSUpdates />,
                  <HomeControlSystemCard />,
                  <AppManager />,
                ],
              },
            ]
          : []),
      ])}
    />
  );
}
