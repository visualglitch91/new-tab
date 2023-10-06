import TV from "../../../components/TV";
import RecentlyRequested from "../../../components/MediaCenter/RecentlyRequested";
import Trending from "../../../components/MediaCenter/Trending";
import Section from "../../../components/Section";
import MasonryLayout from "../../components/DesktopLayout/MasonryLayout";
import AltIconButton from "../../../components/AltIconButton";
import Icon from "../../../components/Icon";
import useModal from "../../../utils/useModal";
import SearchDialog from "./SearchDialog";

export default function MediaPage() {
  const mount = useModal();

  return (
    <MasonryLayout
      items={[
        <TV />,
        <Section title="Na Fila">
          <RecentlyRequested maxHeight={480} />
        </Section>,
        <Section
          title="Populares"
          button={
            <AltIconButton
              onClick={() => {
                mount((_, props) => <SearchDialog {...props} />);
              }}
            >
              <Icon icon="magnify" />
            </AltIconButton>
          }
        >
          <Trending maxHeight={480} />
        </Section>,
      ]}
    />
  );
}
