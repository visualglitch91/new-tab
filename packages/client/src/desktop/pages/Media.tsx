import TV from "../../components/TV";
import RecentlyRequested from "../../components/MediaCenter/RecentlyRequested";
import Trending from "../../components/MediaCenter/Trending";
import Section from "../../components/Section";
import MasonryLayout from "../components/DesktopLayout/MasonryLayout";

export default function MediaPage() {
  return (
    <MasonryLayout
      items={[
        <TV />,
        <Section title="Na Fila">
          <RecentlyRequested maxHeight={480} />
        </Section>,
        <Section title="Populares">
          <Trending maxHeight={480} />
        </Section>,
      ]}
    />
  );
}
