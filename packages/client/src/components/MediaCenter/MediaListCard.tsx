import { MediaItem as IMediaItem } from "@home-control/types/media-center";
import ListCard from "../ListCard";
import { useResponsive } from "../../utils/general";
import MediaItem from "./MediaItem";
import EmptyState from "../EmptyState";

export default function MediaListCard({
  title,
  titleAction,
  itemAction,
  items,
  loading,
  children,
}: {
  title: string;
  titleAction?: React.ReactNode;
  itemAction?: (item: IMediaItem) => React.ReactNode;
  items: IMediaItem[];
  loading?: boolean;
  children?: React.ReactNode;
}) {
  const { isDesktop } = useResponsive();

  return (
    <ListCard title={title} titleAction={titleAction}>
      {children}
      <div style={isDesktop ? { height: "582px", overflow: "auto" } : {}}>
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
      </div>
    </ListCard>
  );
}
