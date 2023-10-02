import { styled, Chip, Tooltip } from "@mui/joy";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  MediaItem as IMediaItem,
  QualityProfile,
} from "@home-control/types/media-center";
import ListItem from "../ListItem";
import { getContrastColor } from "../../utils/general";
import { STATUS_COLORS, STATUS_LABELS, TYPE_LABEL } from "./utils";
import PillButton from "../PillButton";
import api from "../../utils/api";
import { useMenu } from "../../utils/useMenu";
import DotLoading from "../DotLoading";
import { queryClient } from "../../utils/queryClient";
import FlexRow from "../FlexRow";
import MediaPoster from "./MediaPoster";

const Label = styled("div")({
  display: "flex",
  flexDirection: "column",
  lineHeight: 1,
  width: "100%",
  gap: 2,
  "& > span": {
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});

export default function MediaItem({
  item,
  itemAction,
}: {
  item: IMediaItem;
  itemAction?: React.ReactNode;
}) {
  const [showMenu, menu] = useMenu();

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
    <>
      {menu}
      <Tooltip title={item.title}>
        <span>
          <ListItem
            sx={{ py: "6px" }}
            icon={<MediaPoster item={item} />}
            label={
              <Label>
                <span>{item.title}</span>
                <span style={{ fontWeight: 500 }}>
                  {item.year} • {TYPE_LABEL[item.type]}
                </span>
              </Label>
            }
          >
            <FlexRow>
              {item.status !== "not-monitored" ? (
                <Chip
                  size="sm"
                  sx={{
                    color: getContrastColor(STATUS_COLORS[item.status]),
                    backgroundColor: `rgb(${STATUS_COLORS[item.status].join(
                      ","
                    )})`,
                  }}
                >
                  {STATUS_LABELS[item.status]}
                </Chip>
              ) : (
                qualityProfiles &&
                (requestMedia.isLoading ? (
                  <DotLoading />
                ) : (
                  <PillButton label="Requisitar" onClick={request} />
                ))
              )}
              {itemAction}
            </FlexRow>
          </ListItem>
        </span>
      </Tooltip>
    </>
  );
}
