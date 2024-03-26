import { orderBy, partition } from "lodash";
import { Stack } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PackageTrackerItem } from "$common/types/package-tracker";
import { queryClient } from "$client/utils/queryClient";
import { usePrompt } from "$client/utils/usePrompt";
import api from "$client/utils/api";
import useConfirm from "$client/utils/useConfirm";
import { useMenu } from "$client/utils/useMenu";
import EmptyState from "../EmptyState";
import PackageListItem from "./PackageListItem";

function useAction() {
  return useMutation({
    mutationFn: ({
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
        queryClient.invalidateQueries({ queryKey: ["packages"] });
        return;
      });
    },
  });
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

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["packages"],
    queryFn: () => api<PackageTrackerItem[]>("/package-tracker/list", "get"),
  });

  const onRemove = (item: PackageTrackerItem) => {
    confirm({
      title: `Remover "${item.name}"`,
      onConfirm: () => mutate({ action: "remove", code: item.code }),
    });
  };

  const sorted = partition(
    orderBy(packages, [(it) => it.lastEvent?.at || 0, "name"], ["desc", "asc"]),
    (it) => it.status === "delivered"
  )
    .reverse()
    .flat();

  return (
    <>
      {packages.length === 0 ? (
        <EmptyState loading={isLoading} text="Nenhum pacote adicionado" />
      ) : (
        sorted.map((item) => (
          <PackageListItem
            key={item.code}
            item={item}
            onRemove={() => onRemove(item)}
          />
        ))
      )}
    </>
  );
}
