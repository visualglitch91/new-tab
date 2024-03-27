import { groupBy, mapValues, orderBy } from "lodash";
import { Box, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { arrayMove } from "@dnd-kit/sortable";
import { Bookmark } from "$common/types/bookmarks";
import { usePrompt } from "$client/utils/usePrompt";
import api from "$client/utils/api";
import useConfirm from "$client/utils/useConfirm";
import { queryClient } from "$client/utils/queryClient";
import { getSearchParam } from "$client/utils/url";
import { useMenu } from "$client/utils/useMenu";
import MasonryLayout from "$client/desktop/components/DesktopLayout/MasonryLayout";
import AltIconButton from "../AltIconButton";
import SectionTitle from "../SectionTitle";
import Sortable from "../Sortable";
import AutoGrid from "../AutoGrid";
import BookmarkItem from "./BookmarkItem";
import { insertAtIndex, removeItemAtIndex } from "$client/utils/array";

export default function Bookmarks() {
  const prompt = usePrompt();
  const confirm = useConfirm();
  const showMenu = useMenu();
  const isNewTab = getSearchParam("mode") === "new-tab";

  const { data: bookmarks } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => api<Bookmark[]>("/bookmarks", "get"),
    select: (data) => orderBy(data, ["order"], ["asc"]),
  });

  const groupsByKey = mapValues(
    groupBy(
      (bookmarks || []).map((it) => ({
        section: it.section || "Outros",
        ...it,
      })),
      "section"
    ),
    (items, id) => ({ id, items })
  );

  const groups = Object.values(groupsByKey);

  const onRemove = (link: Bookmark) => {
    confirm({
      title: `Deseja remover "${link.name}"?`,
      confirmLabel: "Remover",
      onConfirm: () => {
        api(`/bookmarks/${link.id}`, "delete").then(() => {
          queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
        });
      },
    });
  };

  const onAdd = () => {
    prompt({
      title: "Adicionar Link",
      fields: ["Nome", "Sessão", "URL", "Ícone"],
      onConfirm: (values) => {
        if (values.every(Boolean)) {
          api("/bookmarks", "post", {
            name: values[0],
            section: values[1],
            url: values[2],
            icon: values[3],
            order: bookmarks?.length || 0,
          }).then(() => {
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
          });
        }
      },
    });
  };

  return (
    <MasonryLayout
      minColumnWidth={500}
      maxColumnWidth={500}
      items={[
        <Sortable
          groups={groups}
          renderGroup={({ group, index }, children) => (
            <Stack key={group.id} gap={2}>
              <Stack direction="row" gap={2} alignItems="center">
                <SectionTitle>{group.id}</SectionTitle>
                {index === 0 && <AltIconButton icon="plus" onClick={onAdd} />}
              </Stack>
              <AutoGrid columnWidth={200} gap={6}>
                {children}
              </AutoGrid>
            </Stack>
          )}
          renderItem={(item, refs, wrapperProps, handleProps) => (
            <Box ref={refs.setWrapperRef} {...wrapperProps} {...handleProps}>
              <BookmarkItem
                item={item}
                openInNewTab={isNewTab}
                onContextMenu={(e) => {
                  e.preventDefault();
                  showMenu({
                    mouseEvent: e.nativeEvent,
                    clickAnchor: true,
                    options: [
                      {
                        label: "Deletar",
                        onClick: () => onRemove(item),
                      },
                    ],
                  });
                }}
              />
            </Box>
          )}
          onChange={({ prev, next }) => {
            const data = { ...groupsByKey };
            const itemToMove = { ...data[prev.groupId].items[prev.index] };

            if (prev.groupId === next.groupId) {
              data[prev.groupId].items = arrayMove(
                data[prev.groupId].items,
                prev.index,
                next.index
              );
            } else {
              itemToMove.section = next.groupId;

              data[prev.groupId].items = removeItemAtIndex(
                data[prev.groupId].items,
                prev.index
              );

              data[next.groupId].items = insertAtIndex(
                data[next.groupId].items,
                next.index,
                itemToMove
              );
            }

            const newValues = Object.values(data)
              .map((it) => it.items)
              .flat()
              .map((it, order) => ({ ...it, order }));

            queryClient.setQueryData(["bookmarks"], () => newValues);
            api("/bookmarks/update-all", "post", { bookmarks: newValues });
          }}
        />,
      ]}
    />
  );
}
