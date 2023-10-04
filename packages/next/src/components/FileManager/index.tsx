import api from "../../utils/api";
import useConfirm from "../../utils/useConfirm";
import { useMenu } from "../../utils/useMenu";
import useModal from "../../utils/useModal";
import { usePrompt } from "../../utils/usePrompt";
import FileListCard from "./FileListCard";
import SwitchInstallDialog from "./SwitchInstallDialog";
import { Item, useFileNavigation } from "./utils";

export default function FileManager() {
  const showMenu = useMenu();
  const mount = useModal();
  const prompt = usePrompt();
  const confirm = useConfirm();

  const { current, prev, items, refetch, changeDir } = useFileNavigation();

  function onOptions(item: Item) {
    showMenu({
      title: "Opções",
      options: [
        {
          value: "rename",
          label: "Renomear",
        },
        {
          value: "download",
          label: "Download",
          hidden: item.type === "dir",
        },
        {
          value: "install-switch",
          label: "Instalar no Switch",
          hidden: ![".xci", ".nsp"].some((it) => item.name.endsWith(it)),
        },
        {
          value: "delete",
          label: "Deletar",
        },
      ],
      onSelect: (action) => {
        switch (action) {
          case "install-switch":
            if (item.type === "file") {
              mount((_, props) => (
                <SwitchInstallDialog {...props} file={item} />
              ));
            }

            return;
          case "rename":
            prompt({
              title: "Renomear",
              fields: ["Nome"],
              onConfirm: ([name]) => {
                api(`/file-manager/navigation/files/${item.id}`, "patch", {
                  name,
                }).then(refetch);
              },
            });
            return;
          case "delete":
            confirm({
              title: "Deseja contiuar?",
              onConfirm: () => {
                api(`/file-manager/navigation/files/${item.id}`, "delete").then(
                  refetch
                );
              },
            });
            return;
        }
      },
    });
  }

  if (!current) {
    return null;
  }

  return (
    <FileListCard
      items={items}
      current={current}
      prev={prev}
      onChangeDir={changeDir}
      onOptions={onOptions}
    />
  );
}
