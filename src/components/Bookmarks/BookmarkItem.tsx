import { Bookmark } from "$app/types/bookmarks";
import DesktopButton from "$app/desktop/DesktopButton";
import { PaletteColors } from "$app/theme/palette";

export default function BookmarkItem({
  item,
  color,
  openInNewTab,
}: {
  item: Bookmark;
  color: PaletteColors;
  openInNewTab: boolean;
}) {
  return (
    <DesktopButton
      component="a"
      href={item.url}
      target={openInNewTab ? "_blank" : "_self"}
      rel="noreferrer"
      icon={item.icon}
      color={color}
    >
      {item.name}
    </DesktopButton>
  );
}
