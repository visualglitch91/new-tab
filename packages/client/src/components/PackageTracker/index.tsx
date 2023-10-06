import { Stack } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PackageTrackerItem } from "@home-control/types/package-tracker";
import { queryClient } from "../../utils/queryClient";
import { usePrompt } from "../../utils/usePrompt";
import api from "../../utils/api";
import EmptyState from "../EmptyState";
import useConfirm from "../../utils/useConfirm";
import { orderBy, partition } from "lodash";
import { useMenu } from "../../utils/useMenu";
import PackageListItem from "./PackageListItem";

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

  function onRemove(item: PackageTrackerItem) {
    confirm({
      title: `Remover "${item.name}"`,
      onConfirm: () => mutate({ action: "remove", code: item.code }),
    });
  }

  const sorted = partition(
    orderBy(packages, [(it) => it.lastEvent?.at || 0, "name"], ["desc", "asc"]),
    (it) => it.status === "delivered"
  )
    .reverse()
    .flat();

  return (
    <Stack spacing={2}>
      {packages.length === 0 ? (
        <EmptyState
          loading={isInitialLoading}
          text="Nenhum pacote adicionado"
        />
      ) : (
        sorted.map((item) => (
          <PackageListItem
            key={item.code}
            item={item}
            onRemove={() => onRemove(item)}
          />
        ))
      )}
    </Stack>
  );
}
