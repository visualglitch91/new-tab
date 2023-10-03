import TabLayout from "../../components/TabLayout";
import RouteRedirect from "../../../components/RouteRedirect";
import Recents from "./Recents";
import Trending from "./Trending";
import Search from "./Search";

export default function MediaCenter() {
  return (
    <>
      <RouteRedirect from="/media-center" to="/media-center/recents" />
      <TabLayout
        tabs={[
          {
            label: "Na Fila",
            icon: "playlist-star",
            path: "/media-center/recents",
            component: <Recents />,
          },
          {
            label: "Populares",
            icon: "trending-up",
            path: "/media-center/trending",
            component: <Trending />,
          },
          {
            label: "Busca",
            icon: "magnify",
            path: "/media-center/search",
            component: <Search />,
          },
        ]}
      />
    </>
  );
}
