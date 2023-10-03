import { Stack, Typography, styled } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PackageTrackerItem } from "@home-control/types/package-tracker";
import { useConfirm } from "material-ui-confirm";
import { queryClient } from "../utils/queryClient";
import { usePrompt } from "../utils/usePrompt";
import api from "../utils/api";
import GlossyPaper from "./GlossyPaper";
import EmptyState from "./EmptyState";
import AltIconButton from "./AltIconButton";
import Icon from "./Icon";
import ListItem from "./ListItem";

const Desciption = styled("span")({
  opacity: 0.8,
  fontSize: "14px",
  fontWeight: "bold",
  "& > p": {
    whiteSpace: "pre-wrap",
    margin: "0",
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
      | { action: "add"; name: string; code: string }
      | { action: "remove"; code: string }) => {
      return api(`/package-tracker/${action}`, "post", body).then(() => {
        queryClient.invalidateQueries(["packages"]);
        return;
      });
    }
  );
}

export function useAddPackage() {
  const [prompt, $prompt] = usePrompt();
  const { mutate } = useAction();

  function add() {
    prompt({
      title: "Adicionar",
      fields: ["Nome", "Código"],
      onConfirm: (values) => {
        if (values[0] && values[1]) {
          mutate({ action: "add", name: values[0], code: values[1] });
        }
      },
    });
  }

  return [add, $prompt] as const;
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
    }).then(() => {
      mutate({ action: "remove", code: item.code });
    });
  }

  return (
    <Stack spacing={2}>
      {packages.length === 0 ? (
        <EmptyState
          loading={isInitialLoading}
          text="Nenhum pacote adicionado"
        />
      ) : (
        packages.map(({ lastEvent, ...it }) => {
          return (
            <GlossyPaper key={it.code}>
              <ListItem
                sx={{
                  "& .MuiListItemSecondaryAction-root": {
                    flexDirection: "column",
                    alignItems: "flex-end",
                    py: "6px",
                    "& > *:last-child": {
                      marginTop: lastEvent ? "auto" : "unset",
                    },
                  },
                }}
                primaryText={`${it.name} (${it.code})`}
                secondaryText={
                  lastEvent ? (
                    <Desciption>
                      <p>{lastEvent!.description}</p>
                      {lastEvent.location && <p>{lastEvent.location}</p>}
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
