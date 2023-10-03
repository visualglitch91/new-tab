import FileManager from "../../../components/FileManager";
import PageLayout from "../../components/PageLayout";
import PageTile from "../../components/PageTitle";

export default function Files() {
  return (
    <PageLayout header={<PageTile>Arquivos</PageTile>}>
      <FileManager />
    </PageLayout>
  );
}
