import RouteRedirect from "../../../components/RouteRedirect";
import TabLayout from "../../components/TabLayout";
import Torrents from "./Torrents";
import JDownloader from "./JDownloader";
import Files from "./Files";
import { getAssetUrl } from "../../../assets";
import Icon from "../../../components/Icon";

export default function Downloads() {
  return (
    <>
      <RouteRedirect from="/downloads" to="/downloads/torrents" />
      <TabLayout
        tabs={[
          {
            label: "Torrents",
            icon: "cloud-download-outline",
            path: "/downloads/torrents",
            component: <Torrents />,
          },
          {
            label: "JDownloader",
            icon: <Icon src={getAssetUrl("icons/jdownloader-white.png")} />,
            path: "/downloads/jdownloader",
            component: <JDownloader />,
          },
          {
            label: "Arquivos",
            icon: "folder-multiple-outline",
            path: "/downloads/files",
            component: <Files />,
          },
        ]}
      />
    </>
  );
}
