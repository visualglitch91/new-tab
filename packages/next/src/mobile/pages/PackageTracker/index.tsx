import AltIconButton from "../../../components/AltIconButton";
import Icon from "../../../components/Icon";
import PackageTracker, {
  useAddPackage,
} from "../../../components/PackageTracker";
import PageLayout from "../../components/PageLayout";
import PageTile from "../../components/PageTitle";

export default function PackageTrackerPage() {
  const add = useAddPackage();

  return (
    <PageLayout
      header={<PageTile>Encomendas</PageTile>}
      headerItems={
        <AltIconButton onClick={add}>
          <Icon icon="plus" size={20} />
        </AltIconButton>
      }
    >
      <PackageTracker />
    </PageLayout>
  );
}
