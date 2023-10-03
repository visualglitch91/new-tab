import AltIconButton from "../../../components/AltIconButton";
import Icon from "../../../components/Icon";
import PageLayout from "../../components/PageLayout";
import PageTile from "../../components/PageTitle";

export default function JDownloader() {
  return (
    <PageLayout
      header={<PageTile>JDownloader</PageTile>}
      headerItems={
        <AltIconButton onClick={() => console.log("add link")}>
          <Icon icon="plus" size={20} />
        </AltIconButton>
      }
    >
      {[...new Array(24)]
        .map(
          () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
        )
        .join("\n")}
    </PageLayout>
  );
}
