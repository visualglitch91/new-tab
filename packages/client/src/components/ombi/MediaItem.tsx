import { styled, Chip, Tooltip } from "@mui/joy";
import { useMutation, useQuery } from "@tanstack/react-query";
import { OmbiMedia, QualityProfile } from "@home-control/types/ombi";
import ListItem from "../ListItem";
import { getContrastColor } from "../../utils/general";
import { STATUS_COLORS, STATUS_LABELS, TYPE_LABEL } from "./utils";
import PillButton from "../PillButton";
import api from "../../utils/api";
import { useMenu } from "../../utils/useMenu";
import DotLoading from "../DotLoading";
import { queryClient } from "../../utils/queryClient";
import FlexRow from "../FlexRow";

const Poster = styled("img")(({ theme }) => ({
  width: 42,
  height: 48,
  objectFit: "cover",
  borderRadius: 6,
  backgroundColor: theme.palette.background.body,
  flexShrink: 0,
}));

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
  item: OmbiMedia;
  itemAction?: React.ReactNode;
}) {
  const [showMenu, menu] = useMenu();

  const { data: qualityProfiles } = useQuery<
    Record<OmbiMedia["type"], QualityProfile[]>
  >(["ombi", "quality-profiles"], () => api("/ombi/quality-profiles", "get"));

  const requestMedia = useMutation(
    (body: {
      tmdbId: string;
      type: OmbiMedia["type"];
      qualityProfile: string;
    }) => api("/ombi/request", "post", body),
    { onSuccess: () => queryClient.refetchQueries(["ombi"]) }
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
          tmdbId: item.tmdbId,
          qualityProfile: profile,
        }),
    });
  }

  return (
    <>
      {menu}
      <Tooltip key={item.tmdbId} title={item.title}>
        <span>
          <ListItem
            sx={{ py: "6px" }}
            icon={item.poster ? <Poster src={item.poster} /> : undefined}
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
              {item.request ? (
                <Chip
                  size="sm"
                  sx={{
                    color: getContrastColor(STATUS_COLORS[item.request.status]),
                    backgroundColor: `rgb(${STATUS_COLORS[
                      item.request!.status
                    ].join(",")})`,
                  }}
                >
                  {STATUS_LABELS[item.request!.status]}
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
