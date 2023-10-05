import { Chip, Tooltip, Stack, Button } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  MediaItem as IMediaItem,
  QualityProfile,
} from "@home-control/types/media-center";
import ListItem from "../ListItem";
import { getContrastColor } from "../../utils/colors";
import { STATUS_COLORS, STATUS_LABELS, TYPE_LABEL } from "./utils";
import api from "../../utils/api";
import { useMenu } from "../../utils/useMenu";
import DotLoading from "../DotLoading";
import { queryClient } from "../../utils/queryClient";
import MediaPoster from "./MediaPoster";

export default function MediaItem({
  item,
  itemAction,
}: {
  item: IMediaItem;
  itemAction?: React.ReactNode;
}) {
  const showMenu = useMenu();

  const { data: qualityProfiles } = useQuery<
    Record<IMediaItem["type"], QualityProfile[]>
  >(["media-center", "quality-profiles"], () =>
    api("/media-center/quality-profiles", "get")
  );

  const requestMedia = useMutation(
    (body: {
      mediaId: string;
      type: IMediaItem["type"];
      qualityProfile: string;
    }) => api("/media-center/request", "post", body),
    { onSuccess: () => queryClient.refetchQueries(["media-center"]) }
  );

  function request() {
    showMenu({
      title: "Qualidade",
      options: (qualityProfiles?.[item.type] || []).map((it) => ({
        value: String(it.id),
        label: it.name,
      })),
      onSelect: (profile) =>
        requestMedia.mutate({
          type: item.type,
          mediaId: item.mediaId,
          qualityProfile: profile,
        }),
    });
  }

  return (
    <ListItem
      sx={{ py: "6px" }}
      startSlot={<MediaPoster item={item} />}
      primaryText={item.title}
      secondaryText={`${item.year} • ${TYPE_LABEL[item.type]}`}
      endSlot={
        <Stack direction="row" alignItems="center" gap="6px">
          {item.status !== "not-monitored" ? (
            <Chip
              size="small"
              sx={{
                color: getContrastColor(STATUS_COLORS[item.status]),
                backgroundColor: `rgb(${STATUS_COLORS[item.status].join(",")})`,
              }}
              label={STATUS_LABELS[item.status]}
            />
          ) : (
            qualityProfiles &&
            (requestMedia.isLoading ? (
              <DotLoading />
            ) : (
              <Button size="small" onClick={request}>
                Requisitar
              </Button>
            ))
          )}
          {itemAction}
        </Stack>
      }
    />
  );
}
