import { MediaItem as IMediaItem } from "@home-control/types/media-center";
import { useResponsive } from "../../utils/general";
import MediaItem from "./MediaItem";
import EmptyState from "../EmptyState";
import ResponsiveCard from "../ResponsiveCard";

export default function MediaListCard({
  title,
  titleChildren,
  itemAction,
  items,
  loading,
  children,
}: {
  title: string;
  titleChildren?: React.ReactNode;
  itemAction?: (item: IMediaItem) => React.ReactNode;
  items: IMediaItem[];
  loading?: boolean;
  children?: React.ReactNode;
}) {
  const { isDesktop } = useResponsive();

  return (
    <ResponsiveCard
      title={title}
      titleChildren={titleChildren}
      contentPadding={0}
      groups={[
        <>
          {children}
          <div
            style={{
              margin: "12px 0",
              ...(isDesktop ? { height: "582px", overflow: "auto" } : {}),
            }}
          >
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
        </>,
      ]}
    />
  );
}
