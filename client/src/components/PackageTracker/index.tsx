import { orderBy } from "lodash";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PackageTrackerItem } from "$common/types/package-tracker";
import { queryClient } from "$client/utils/queryClient";
import { usePrompt } from "$client/utils/usePrompt";
import api from "$client/utils/api";
import useConfirm from "$client/utils/useConfirm";
import { useMenu } from "$client/utils/useMenu";
import EmptyState from "../EmptyState";
import PackageListItem from "./PackageListItem";
import AltIconButton from "../AltIconButton";

const statusPriority: Record<PackageTrackerItem["status"], number> = {
  "en-route": 4,
  "in-transit": 3,
  "pending-payment": 2,
  "not-found": 1,
  delivered: 0,
};

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

export function PackageTrackerMenu() {
  const prompt = usePrompt();
  const { mutate } = useAction();
  const showMenu = useMenu();

  const refresh = () => {
    mutate({ action: "refresh" });
  };

  const addPackage = () => {
    prompt({
      title: "Adicionar",
      fields: ["Código", "Nome"],
      onConfirm: (values) => {
        if (values[0] && values[1]) {
          mutate({ action: "add", name: values[1], code: values[0] });
        }
      },
    });
  };

  return (
    <AltIconButton
      icon="dots-vertical"
      onClick={(e) =>
        showMenu({
          mouseEvent: e.nativeEvent,
          options: [
            { label: "Atualizar", onClick: refresh },
            { label: "Rastrear", onClick: addPackage },
          ],
        })
      }
    />
  );
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
      onConfirm: () => mutate({ action: "remove", code: item.id }),
    });
  };

  const sorted = orderBy(
    packages,
    [(it) => statusPriority[it.status], (it) => it.lastEvent?.at || 0, "name"],
    ["desc", "desc", "asc"]
  );

  return (
    <>
      {packages.length === 0 ? (
        <EmptyState loading={isLoading} text="Nenhum pacote adicionado" />
      ) : (
        sorted.map((item) => (
          <PackageListItem
            key={item.id}
            item={item}
            onRemove={() => onRemove(item)}
          />
        ))
      )}
    </>
  );
}
