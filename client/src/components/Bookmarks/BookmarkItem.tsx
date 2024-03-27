import { Bookmark } from "$common/types/bookmarks";
import { Typography } from "@mui/material";
import HugeButton from "../HugeButton";

export default function BookmarkItem({
  item,
  openInNewTab,
  onContextMenu,
}: {
  item: Bookmark;
  openInNewTab: boolean;
  onContextMenu: (e: React.MouseEvent<HTMLElement>) => void;
}) {
  return (
    <HugeButton
      component="a"
      href={item.url}
      target={openInNewTab ? "_blank" : "_self"}
      rel="noreferrer"
      onContextMenu={onContextMenu}
      sx={{
        flexDirection: "row",
        justifyContent: "flex-start",
        py: 1.5,
        px: 1.8,
        borderRadius: "8px",
        gap: 1.8,
      }}
    >
      <img
        style={{ width: 32, height: 32, borderRadius: 4 }}
        src={item.icon}
        alt=""
      />
      <Typography fontWeight="medium">{item.name}</Typography>
    </HugeButton>
  );
}
