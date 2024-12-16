import { groupBy, mapValues, orderBy } from "lodash";
import { Stack } from "@mui/material";
import { Bookmark } from "$app/types/bookmarks";
import { useBreakpointValue } from "$app/utils/useBreakpointValue";
import { mode } from "$app/utils/general";
import bookmarksJSON from "$app/bookmarks.json";
import SectionTitle from "../SectionTitle";
import AutoGrid from "../AutoGrid";
import BookmarkItem from "./BookmarkItem";

const bookmarks: Bookmark[] = orderBy(bookmarksJSON, ["order"], ["asc"]);

export default function Bookmarks() {
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
      <Stack gap={2} key={`cell_${group.id}`}>
        <Stack direction="row" gap={2} alignItems="center">
          <SectionTitle>{group.id}</SectionTitle>
        </Stack>
        <AutoGrid columnWidth={200} gap={6}>
          {group.items.map((item) => (
            <BookmarkItem
              key={item.id}
              item={item}
              openInNewTab={!mode.newTab}
            />
          ))}
        </AutoGrid>
      </Stack>
    );

    currentColumnLength += itemArray.length;
  });

  return (
    <div>
      <Stack gap={4} direction="row" width="100%">
        {columns.map((cells, index) => (
          <Stack key={index} gap={4} direction="column" width="100%">
            {cells}
          </Stack>
        ))}
      </Stack>
    </div>
  );
}
