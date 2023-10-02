import { formatNumericValue } from "../utils/general";
import ComponentGroup from "../components/ComponentGroup";

export default function ServerModule() {
  return (
    <ComponentGroup
      title="Servidor"
      layout="list"
      items={[
        {
          entityId: "switch.pi_hole",
          changeTimeout: 30_000,
        },
        {
          label: "Uso do Disco de Mídia",
          entityId: "sensor.disk_use_percent_drives_visualglitch91",
          renderListContent: (entity) => formatNumericValue(entity.state, "%"),
        },
        {
          icon: "icofont-thermometer",
          label: "Temperatura",
          entityId: "sensor.processor_temperature",
          renderListContent: (entity) => formatNumericValue(entity.state, "°C"),
        },
        {
          label: "Processador",
          entityId: "sensor.processor_use",
          renderListContent: (entity) => formatNumericValue(entity.state, "%"),
        },
        {
          label: "Memória",
          entityId: "sensor.memory_use_percent",
          renderListContent: (entity) => formatNumericValue(entity.state, "%"),
        },
        {
          label: "Reiniciar Servidor",
          confirmBefore: true,
          entityId: "script.servidor_reiniciar",
        },
      ]}
    />
  );
}
