import PageLayout from "../../components/PageLayout";
import PageTile from "../../components/PageTitle";

export default function Trending() {
  return (
    <PageLayout header={<PageTile>Populares</PageTile>}>
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
