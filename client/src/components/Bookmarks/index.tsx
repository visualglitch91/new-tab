import React, { useState } from "react";
import { createPortal } from "react-dom";
import { groupBy, mapValues, orderBy } from "lodash";
import { Box, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { arrayMove } from "@dnd-kit/sortable";
import { Bookmark } from "$common/types/bookmarks";
import { usePrompt } from "$client/utils/usePrompt";
import api from "$client/utils/api";
import useConfirm from "$client/utils/useConfirm";
import { queryClient } from "$client/utils/queryClient";
import { useMenu } from "$client/utils/useMenu";
import useMountEffect from "$client/utils/useMountEffect";
import { insertAtIndex, removeItemAtIndex } from "$client/utils/array";
import { mode } from "$client/utils/general";
import AltIconButton from "../AltIconButton";
import SectionTitle from "../SectionTitle";
import Sortable from "../Sortable";
import AutoGrid from "../AutoGrid";
import BookmarkItem from "./BookmarkItem";
import { useBreakpointValue } from "$client/utils/useBreakpointValue";

function Portal({
  nodeId,
  children,
}: {
  nodeId: string;
  children: React.ReactNode;
}) {
  const node = document.getElementById(nodeId);

  if (!node) {
    return null;
  }

  return createPortal(children, node);
}

export default function Bookmarks() {
  const prompt = usePrompt();
  const confirm = useConfirm();
  const showMenu = useMenu();
  const [ready, setReady] = useState(false);

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

  const columnCount = useBreakpointValue({ xs: 1, sm: 1, md: 1, lg: 2, xl: 3 });
  const columns: React.ReactNode[][] = Array.from(
    { length: columnCount },
    () => []
  );

  const itemsPerColumn = Math.ceil(
    groups.reduce((acc, current) => acc + current.items.length, 0) / columnCount
  );

  let columnIndex = 0;
  let currentColumnLength = 0;

  groups.forEach((group) => {
    const itemArray = group.items;

    if (currentColumnLength + itemArray.length > itemsPerColumn) {
      columnIndex++;

      if (columnIndex === columnCount) {
        columnIndex = 0;
      }

      currentColumnLength = 0;
    }

    columns[columnIndex].push(
      <Stack gap={2} key={`cell_${group.id}`} id={`cell_${group.id}`} />
    );

    currentColumnLength += itemArray.length;
  });

  useMountEffect(() => setReady(true));

  return (
    <div>
      <Stack gap={4} direction="row" width="100%">
        {columns.map((cells, index) => (
          <Stack key={index} gap={4} direction="column" width="100%">
            {cells}
          </Stack>
        ))}
      </Stack>
      {ready && (
        <Sortable
          groups={groups}
          renderGroup={({ group, index }, children) => {
            return (
              <Portal key={group.id} nodeId={`cell_${group.id}`}>
                <Stack direction="row" gap={2} alignItems="center">
                  <SectionTitle>{group.id}</SectionTitle>
                  {index === 0 && <AltIconButton icon="plus" onClick={onAdd} />}
                </Stack>
                <AutoGrid columnWidth={200} gap={6}>
                  {children}
                </AutoGrid>
              </Portal>
            );
          }}
          renderItem={(item, refs, wrapperProps, handleProps) => (
            <Box ref={refs.setWrapperRef} {...wrapperProps} {...handleProps}>
              <BookmarkItem
                item={item}
                openInNewTab={!mode.newTab}
                onContextMenu={(e) => {
                  e.preventDefault();
                  showMenu({
                    mouseEvent: e.nativeEvent,
                    clickAnchor: true,
                    options: [
                      { label: "Deletar", onClick: () => onRemove(item) },
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
        />
      )}
    </div>
  );
}
