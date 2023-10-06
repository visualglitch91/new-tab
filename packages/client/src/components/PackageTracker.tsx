import { Box, Stack, Typography, styled } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PackageTrackerItem } from "@home-control/types/package-tracker";
import { queryClient } from "../utils/queryClient";
import { usePrompt } from "../utils/usePrompt";
import api from "../utils/api";
import GlossyPaper from "./GlossyPaper";
import EmptyState from "./EmptyState";
import AltIconButton from "./AltIconButton";
import Icon from "./Icon";
import ListItem from "./ListItem";
import useConfirm from "../utils/useConfirm";
import { orderBy } from "lodash";
import { useMenu } from "../utils/useMenu";
import ColorBadge from "./ColorBadge";

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

function useAction() {
  return useMutation(
    ({
      action,
      ...body
    }:
      | { action: "refresh" }
      | { action: "add"; name: string; code: string }
      | { action: "remove"; code: string }) => {
      return api(
        `/package-tracker/${action}`,
        action === "refresh" ? "get" : "post",
        body
      ).then(() => {
        queryClient.invalidateQueries(["packages"]);
        return;
      });
    }
  );
}

export function usePackageTrackerMenu() {
  const prompt = usePrompt();
  const showMenu = useMenu();
  const { mutate } = useAction();

  function refresh() {
    mutate({ action: "refresh" });
  }

  function addPackage() {
    prompt({
      title: "Adicionar",
      fields: ["Código", "Nome"],
      onConfirm: (values) => {
        if (values[0] && values[1]) {
          mutate({ action: "add", name: values[1], code: values[0] });
        }
      },
    });
  }

  return function showPackageTrackerMenu() {
    showMenu({
      title: "Opções",
      options: {
        refresh: { label: "Atualizar", action: refresh },
        add: { label: "Rastrear", action: addPackage },
      },
    });
  };
}

export default function PackageTracker() {
  const confirm = useConfirm();
  const { mutate } = useAction();
  const { data: packages = [], isInitialLoading } = useQuery(["packages"], () =>
    api<PackageTrackerItem[]>("/package-tracker/list", "get")
  );

  function remove(item: PackageTrackerItem) {
    confirm({
      title: `Remover "${item.name}"`,
      onConfirm: () => mutate({ action: "remove", code: item.code }),
    });
  }

  console.log(packages);

  return (
    <Stack spacing={2}>
      {packages.length === 0 ? (
        <EmptyState
          loading={isInitialLoading}
          text="Nenhum pacote adicionado"
        />
      ) : (
        orderBy(
          packages,
          [(it) => it.lastEvent?.at || 0, "name"],
          ["desc", "asc"]
        ).map(({ lastEvent, ...it }) => {
          return (
            <GlossyPaper key={it.code}>
              <ListItem
                sx={{
                  "& .MuiListItemSecondaryAction-root": {
                    py: "6px",
                    alignItems: "flex-end",
                    flexDirection: "column",
                    justifyContent: lastEvent ? "space-between" : "center",
                  },
                }}
                primaryText={
                  <Stack direction="row" alignItems="center" spacing={0.8}>
                    <ColorBadge
                      size={12}
                      sx={{ flexShrink: 0 }}
                      color={STATUS_COLORS[it.status]}
                    />
                    <Box
                      sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                    >{`${it.name} (${it.code})`}</Box>
                  </Stack>
                }
                secondaryText={
                  lastEvent ? (
                    <Desciption>
                      <span>{lastEvent!.description}</span>
                      {lastEvent.location && <span>{lastEvent.location}</span>}
                    </Desciption>
                  ) : (
                    <Desciption>Não Encontrado</Desciption>
                  )
                }
                endSlot={
                  <>
                    {lastEvent?.at && (
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {parseDate(lastEvent.at)}
                      </Typography>
                    )}
                    <span>
                      <AltIconButton size="small" onClick={() => remove(it)}>
                        <Icon size={18} icon="close" />
                      </AltIconButton>
                    </span>
                  </>
                }
              />
            </GlossyPaper>
          );
        })
      )}
    </Stack>
  );
}
