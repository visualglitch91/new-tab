import { formatNumericValue } from "$app/utils/general";
import { EntityListItems } from "./EntityListItem";
import ListSection from "./ListSection";

export default function ServerModule() {
  return (
    <ListSection title="Servidor">
      <EntityListItems
        items={[
          {
            label: "/root",
            icon: "harddisk",
            entityId: "sensor.system_monitor_disk_usage_disks_root",
            renderListContent: (entity) =>
              formatNumericValue(entity.state, "%"),
          },
          {
            label: "/sunsetdrive91",
            icon: "harddisk",
            entityId: "sensor.system_monitor_disk_usage_disks_sunsetdrive91",
            renderListContent: (entity) =>
              formatNumericValue(entity.state, "%"),
          },
          {
            label: "/visualglitch91",
            icon: "harddisk",
            entityId: "sensor.system_monitor_disk_usage_disks_visualglitch91",
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
