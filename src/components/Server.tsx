import { formatNumericValue } from "$app/utils/general";
import { EntityListItems } from "./EntityListItem";
import ListSection from "./ListSection";

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
        ]}
      />
    </ListSection>
  );
}
