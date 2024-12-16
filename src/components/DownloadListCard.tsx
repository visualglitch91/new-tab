import { sortBy } from "lodash";
import {
  List,
  alpha,
  Stack,
  styled,
  ButtonBase,
  LinearProgress,
} from "@mui/material";
import { humanizeDuration } from "$app/utils/dateTime";
import { formatNumericValue } from "$app/utils/general";
import EmptyState from "./EmptyState";
import GlossyPaper from "./GlossyPaper";
import Icon from "./Icon";

const ItemCard = styled(ButtonBase)(({ theme }) => ({
  padding: "20px 16px",
  width: "100%",
  justifyContent: "stretch",
  textAlign: "left",
  background: "transparent",
  borderRadius: 0,
  borderTop: `1px solid ${alpha(theme.palette.primary.dark, 0.7)}`,
  "&:hover": { backgroundColor: alpha(theme.palette.grey[800], 0.3) },
}));

const ItemContent = styled("div")({
  display: "flex",
  flexDirection: "column",
  rowGap: "8px",
  width: "100%",
  alignItems: "flex-start",
  overflow: "hidden",
});

const Header = styled("div")({
  display: "flex",
  gap: "8px",
  width: "100%",
  overflow: "hidden",
});

const Name = styled("span")({
  flex: 1,
  fontSize: "14px",
  fontWeight: 500,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const Details = styled("div")({
  display: "flex",
  gap: "8px",
  opacity: 0.8,
  fontSize: "12px",
  fontWeight: 600,
});

const STATUS_LABELS = {
  downloading: "Baixando",
  seeding: "Subindo",
  completed: "Completo",
  stopped: "Parado",
  error: "Erro",
  queued: "Na Fila",
  verifying: "Verificando",
};

export type DownloadStatus =
  | "downloading"
  | "seeding"
  | "completed"
  | "stopped"
  | "queued"
  | "verifying"
  | "error";

export interface DownloadItem {
  id: string;
  name: string;
  eta: number | null;
  status: DownloadStatus;
  active: boolean;
  completed: boolean;
  percentDone: number;
}

const statusOrder: DownloadStatus[] = [
  "verifying",
  "downloading",
  "stopped",
  "queued",
  "seeding",
  "completed",
  "error",
];

export default function DownloadListCard({
  downloads,
  loading,
  children,
  maxHeight,
  onItemClick,
}: {
  downloads: DownloadItem[];
  loading?: boolean;
  maxHeight?: number;
  children?: React.ReactNode;
  onItemClick: (item: DownloadItem) => void;
}) {
  return (
    <Stack component={GlossyPaper}>
      {children}
      <List sx={maxHeight ? { maxHeight, overflow: "auto" } : {}}>
        {downloads.length === 0 ? (
          <EmptyState
            sx={{ pt: "18px" }}
            loading={loading}
            text="Nenhum download adicionado"
          />
        ) : (
          sortBy(downloads, (it) => statusOrder.indexOf(it.status)).map(
            (it) => (
              <ItemCard key={it.id} onClick={() => onItemClick(it)}>
                <ItemContent>
                  <Header>
                    <Icon
                      size={16}
                      icon={
                        it.completed
                          ? "mdi-check"
                          : it.status === "seeding"
                          ? "mdi-arrow-up"
                          : it.active
                          ? "mdi-arrow-down"
                          : "mdi-pause"
                      }
                    />
                    <Name>{it.name}</Name>
                  </Header>
                  <LinearProgress
                    variant="determinate"
                    value={it.percentDone}
                    sx={{ width: "100%", height: "6px", borderRadius: "4px" }}
                  />
                  <Details>
                    <span>{STATUS_LABELS[it.status]}</span>
                    <span>{formatNumericValue(it.percentDone, "%", 0)}</span>
                    <span>{it.eta && humanizeDuration(it.eta)}</span>
                  </Details>
                </ItemContent>
              </ItemCard>
            )
          )
        )}
      </List>
    </Stack>
  );
}
