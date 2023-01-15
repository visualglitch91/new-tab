import { formatNumericValue } from "../utils/general";
import ComponentGroup from "../components/ComponentGroup";

const systemModule = (
  <ComponentGroup
    title="Sistema"
    layout="list"
    items={[
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
        label: "Ventoinha",
        entityId: "sensor.processor_fan_speed",
        renderListContent: (entity) => `${entity.state} RPM`,
      },
      {
        label: "Memória",
        entityId: "sensor.memory_use_percent",
        renderListContent: (entity) => formatNumericValue(entity.state, "%"),
      },
      {
        label: "Reiniciar Servidor",
        entityId: "script.servidor_reiniciar",
      },
    ]}
  />
);

export default systemModule;
