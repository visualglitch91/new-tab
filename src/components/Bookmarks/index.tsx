import { Fragment } from "react";
import { groupBy, mapValues, orderBy } from "lodash";
import { Divider, Stack } from "@mui/material";
import { Bookmark } from "$app/types/bookmarks";
import { mode } from "$app/utils/general";
import Flex from "$app/components/Flex";
import bookmarksJSON from "$app/bookmarks.json";
import SectionTitle from "../SectionTitle";
import BookmarkItem from "./BookmarkItem";
import { PaletteColors } from "$app/theme/palette";

const bookmarks: Bookmark[] = orderBy(bookmarksJSON, ["order"], ["asc"]);

const iconColors: PaletteColors[] = [
  "mauve",
  "red",
  "peach",
  "yellow",
  "green",
  "sky",
  "blue",
  "lavender",
];

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

  return (
    <Stack gap={3}>
      {groups.map((group, index) => (
        <Fragment key={index}>
          <Stack gap={2}>
            <SectionTitle>{group.id}</SectionTitle>
            <Flex wrap="wrap" gap={1} sx={{ "& > *": { flexShrink: 0 } }}>
              {group.items.map((item, index) => {
                const iconColor = iconColors[index % iconColors.length];

                return (
                  <BookmarkItem
                    key={item.id}
                    item={item}
                    color={iconColor}
                    openInNewTab={!mode.newTab}
                  />
                );
              })}
            </Flex>
          </Stack>
          {index < groups.length - 1 && <Divider />}
        </Fragment>
      ))}
    </Stack>
  );
}
