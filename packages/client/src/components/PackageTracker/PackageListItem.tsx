import { Box, Stack, Typography, styled } from "@mui/material";
import { PackageTrackerItem } from "@home-control/types/package-tracker";
import GlossyPaper from "../GlossyPaper";
import AltIconButton from "../AltIconButton";
import Icon from "../Icon";
import ListItem from "../ListItem";
import ColorBadge from "../ColorBadge";

const STATUS_COLORS = {
  delivered: "#50fa7b",
  "in-transit": "#8be9fd",
  "pending-payment": "#f1fa8c",
  "not-found": "#ff5555",
} as const;

const Desciption = styled("span")({
  opacity: 0.8,
  fontSize: "14px",
  fontWeight: "bold",
  "& > span": {
    whiteSpace: "pre-wrap",
    display: "block",
  },
});

function parseDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    month: "short",
    day: "numeric",
  });
}

export default function PackageListItem({
  item,
  onRemove,
}: {
  item: PackageTrackerItem;
  onRemove: () => void;
}) {
  return (
    <GlossyPaper>
      <ListItem
        sx={{
          "& .MuiListItemSecondaryAction-root": {
            py: "6px",
            alignItems: "flex-end",
            flexDirection: "column",
            justifyContent: item.lastEvent ? "space-between" : "center",
          },
        }}
        primaryText={
          <Stack direction="row" alignItems="center" spacing={0.8}>
            <ColorBadge
              size={12}
              sx={{ flexShrink: 0 }}
              color={STATUS_COLORS[item.status]}
            />
            <Box
              sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
            >{`${item.name} (${item.code})`}</Box>
          </Stack>
        }
        secondaryText={
          item.lastEvent ? (
            <Desciption>
              <span>{item.lastEvent.description}</span>
              {item.lastEvent.location && (
                <span>{item.lastEvent.location}</span>
              )}
            </Desciption>
          ) : (
            <Desciption>Não Encontrado</Desciption>
          )
        }
        endSlot={
          <>
            {item.lastEvent?.at && (
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {parseDate(item.lastEvent.at)}
              </Typography>
            )}
            <span>
              <AltIconButton size="small" onClick={onRemove}>
                <Icon size={18} icon="close" />
              </AltIconButton>
            </span>
          </>
        }
      />
    </GlossyPaper>
  );
}
