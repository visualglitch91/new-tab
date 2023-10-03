import { MediaItem as IMediaItem } from "@home-control/types/media-center";
import MediaItem from "./MediaItem";
import EmptyState from "../EmptyState";
import GlossyPaper from "../GlossyPaper";
import { List } from "@mui/material";

export default function MediaListCard({
  itemAction,
  items,
  loading,
}: {
  itemAction?: (item: IMediaItem) => React.ReactNode;
  items: IMediaItem[];
  loading?: boolean;
}) {
  return (
    <List component={GlossyPaper}>
      {items.length === 0 ? (
        <EmptyState
          sx={{ height: "100%" }}
          loading={loading}
          text="Nenhum filme ou série encontrado"
        />
      ) : (
        items.map((item) => (
          <MediaItem
            key={`${item.type}_${item.mediaId}`}
            item={item}
            itemAction={itemAction?.(item)}
          />
        ))
      )}
    </List>
  );
}
