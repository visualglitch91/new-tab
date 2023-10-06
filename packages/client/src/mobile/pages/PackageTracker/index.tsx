import AltIconButton from "../../../components/AltIconButton";
import Icon from "../../../components/Icon";
import PackageTracker, {
  usePackageTrackerMenu,
} from "../../../components/PackageTracker";
import PageLayout from "../../components/PageLayout";
import PageTile from "../../components/PageTitle";

export default function PackageTrackerPage() {
  const showMenu = usePackageTrackerMenu();

  return (
    <PageLayout
      header={<PageTile>Encomendas</PageTile>}
      headerItems={
        <AltIconButton onClick={showMenu}>
          <Icon icon="dots-vertical" size={20} />
        </AltIconButton>
      }
    >
      <PackageTracker />
    </PageLayout>
  );
}
