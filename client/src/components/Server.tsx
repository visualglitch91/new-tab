import { Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { formatNumericValue } from "$client/utils/general";
import api from "$client/utils/api";
import { EntityListItems } from "./EntityListItem";
import ListItem from "./ListItem";
import ListSection from "./ListSection";
import DotLoading from "./DotLoading";

function DockerImageUpdatesListItem() {
  const $status = useQuery({
    queryKey: ["apps/docker-check-updates-status"],
    queryFn: () =>
      api<{ running: boolean }>(
        "/app-manager/docker/all/check-image-updates/status",
        "get"
      ),
    refetchInterval: 5000,
  });

  return (
    <ListItem
      icon="docker"
      primaryText="Atualizações de Containers"
      endSlot={
        $status.data?.running ? (
          <DotLoading />
        ) : (
          <Button
            onClick={() => {
              api("/app-manager/docker/all/check-image-updates", "post").then(
                () => $status.refetch()
              );
            }}
          >
            Buscar
          </Button>
        )
      }
    />
  );
}

export default function ServerModule() {
  return (
    <ListSection title="Servidor">
      <EntityListItems
        items={[
          {
            label: "Uso do Disco de Mídia",
            entityId: "sensor.disk_use_percent_drives_visualglitch91",
            renderListContent: (entity) =>
              formatNumericValue(entity.state, "%"),
          },
          {
            icon: "icofont-thermometer",
            label: "Temperatura",
            entityId: "sensor.processor_temperature",
            renderListContent: (entity) =>
              formatNumericValue(entity.state, "°C"),
          },
          {
            label: "Processador",
            entityId: "sensor.processor_use",
            renderListContent: (entity) =>
              formatNumericValue(entity.state, "%"),
          },
          {
            label: "Memória",
            entityId: "sensor.memory_use_percent",
            renderListContent: (entity) =>
              formatNumericValue(entity.state, "%"),
          },
          {
            label: "Reiniciar Servidor",
            confirmBefore: true,
            entityId: "script.servidor_reiniciar",
          },
        ]}
      />
      <DockerImageUpdatesListItem />
    </ListSection>
  );
}
