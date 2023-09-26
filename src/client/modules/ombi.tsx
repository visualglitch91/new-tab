import { styled, Chip, Tooltip } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";
import ListCard from "../components/ListCard";
import ListItem from "../components/ListItem";
import { RGB, getContrastColor } from "../utils/general";
import PillButton from "../components/PillButton";
import { OmbiMedia } from "../../types/ombi";

const STATUS_COLORS = {
  available: [56, 142, 60],
  partially: [0, 151, 167],
  approved: [2, 119, 189],
  denied: [198, 40, 40],
  pending: [255, 143, 0],
} as Record<string, RGB>;

const STATUS_LABELS = {
  available: "Disponível",
  partially: "Parcial",
  approved: "Aprovado",
  denied: "Negado",
  pending: "Pendente",
};

const TYPE_LABEL = {
  tv: "Série",
  movie: "Filme",
};

const Poster = styled("img")({
  height: 56,
  borderRadius: 6,
});

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

function OmbiRecentlyRequested() {
  const { data = [] } = useQuery(
    ["ombi-recently-requested"],
    () => api<OmbiMedia[]>("/ombi/recently-requested", "get"),
    { refetchInterval: 20_000 }
  );

  return (
    <ListCard
      title="Últimas Requisições"
      titleAction={<PillButton icon="magnify" />}
    >
      {data.map((it) => (
        <Tooltip key={it.id} title={it.title}>
          <span>
            <ListItem
              sx={{ py: "6px" }}
              icon={it.poster ? <Poster src={it.poster} /> : undefined}
              label={
                <Label>
                  <span>{it.title}</span>
                  <span style={{ fontWeight: 500 }}>
                    {new Date(it.releaseDate).getFullYear()} •{" "}
                    {TYPE_LABEL[it.type]}
                  </span>
                </Label>
              }
            >
              <Chip
                size="sm"
                sx={{
                  color: getContrastColor(STATUS_COLORS[it.request!.status]),
                  backgroundColor: `rgb(${STATUS_COLORS[
                    it.request!.status
                  ].join(",")})`,
                }}
              >
                {STATUS_LABELS[it.request!.status]}
              </Chip>
            </ListItem>
          </span>
        </Tooltip>
      ))}
    </ListCard>
  );
}

const ombiModule = <OmbiRecentlyRequested />;

export default ombiModule;
