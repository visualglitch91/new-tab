import { useQuery } from "@tanstack/react-query";
import { Bookmark } from "@home-control/types/bookmarks";
import { usePrompt } from "../utils/usePrompt";
import useConfirm from "../utils/useConfirm";
import GlossyPaper from "./GlossyPaper";
import api from "../utils/api";
import { isNewTab } from "../utils/general";
import { queryClient } from "../utils/queryClient";
import LinksGrid, { Link } from "./LinksGrid";

export default function Bookmarks() {
  const prompt = usePrompt();
  const confirm = useConfirm();

  function onRemove(link: Link) {
    confirm({
      title: `Deseja remover "${link.name}"?`,
      confirmLabel: "Remover",
      onConfirm: () => {
        api(`/bookmarks/${link.id}`, "delete").then(() => {
          queryClient.invalidateQueries(["bookmarks"]);
        });
      },
    });
  }

  function onAdd() {
    prompt({
      title: "Adicionar Link",
      fields: ["Nome", "URL", "Ícone"],
      onConfirm: (values) => {
        if (values.every(Boolean)) {
          api("/bookmarks", "post", {
            name: values[0],
            url: values[1],
            icon: values[2],
          }).then(() => {
            queryClient.invalidateQueries(["bookmarks"]);
          });
        }
      },
    });
  }

  const { data: bookmarks = [] } = useQuery(["bookmarks"], () =>
    api<Bookmark[]>("/bookmarks", "get")
  );

  return (
    <GlossyPaper>
      <LinksGrid
        target={isNewTab ? "_parent" : "_blank"}
        items={bookmarks.map((it) => ({ ...it, href: it.url }))}
        onHold={onRemove}
        onAdd={onAdd}
      />
    </GlossyPaper>
  );
}
