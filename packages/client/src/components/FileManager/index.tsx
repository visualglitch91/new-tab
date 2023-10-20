import api from "../../utils/api";
import useConfirm from "../../utils/useConfirm";
import { useMenu } from "../../utils/useMenu";
import useModal from "../../utils/useModal";
import { usePrompt } from "../../utils/usePrompt";
import FileListCard from "./FileListCard";
import SwitchInstallDialog from "./SwitchInstallDialog";
import { Item, useFileNavigation } from "./utils";

export default function FileManager({ maxHeight }: { maxHeight?: number }) {
  const showMenu = useMenu();
  const mount = useModal();
  const prompt = usePrompt();
  const confirm = useConfirm();

  const { current, prev, items, refetch, changeDir } = useFileNavigation();

  function onOptions(item: Item) {
    showMenu({
      title: "Opções",
      options: {
        rename: {
          label: "Renomear",
          action: () => {
            prompt({
              title: "Renomear",
              fields: ["Nome"],
              onConfirm: ([name]) => {
                api(`/file-manager/navigation/files/${item.id}`, "patch", {
                  name,
                }).then(refetch);
              },
            });
          },
        },
        "install-switch": {
          label: "Instalar no Switch",
          hidden: ![".xci", ".nsp", ".nsz"].some((it) =>
            item.name.toLowerCase().endsWith(it)
          ),
          action: () => {
            if (item.type === "file") {
              mount((_, props) => (
                <SwitchInstallDialog {...props} file={item} />
              ));
            }
          },
        },
        delete: {
          label: "Deletar",
          action: () => {
            confirm({
              title: "Deseja contiuar?",
              onConfirm: () => {
                api(`/file-manager/navigation/files/${item.id}`, "delete").then(
                  refetch
                );
              },
            });
          },
        },
      },
    });
  }

  if (!current) {
    return null;
  }

  return (
    <FileListCard
      items={items}
      maxHeight={maxHeight}
      current={current}
      prev={prev}
      onChangeDir={changeDir}
      onOptions={onOptions}
    />
  );
}
