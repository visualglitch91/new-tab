import { formatNumericValue } from "../utils/general";
import ComponentGroup from "../components/ComponentGroup";
import Stack from "../components/Stack";
import AppMonitor from "../components/AppMonitor";

const systemModule = (
  <Stack>
    <ComponentGroup
      title="Sistema"
      layout="list"
      items={[
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
    <ComponentGroup
      title="Baterias"
      layout="list"
      items={[
        ["sensor.lavanderia_tanque_bateria", "Sensor do Tanque"],
        [
          "sensor.banheiro_porta_do_escritorio_bateria",
          "Sensor da Porta do Banheiro/Escritório",
        ],
        [
          "sensor.banheiro_porta_do_quarto_bateria",
          "Sensor da Porta do Banheiro/Quarto",
        ],
        ["sensor.sala_porta_bateria", "Sensor da Porta da Sala"],
      ].map(([entityId, label]) => ({
        label,
        entityId,
        icon: "battery-50",
        renderListContent: (entity) => formatNumericValue(entity.state, "%", 0),
      }))}
    />
    <AppMonitor entityId="sensor.app_monitor" />
  </Stack>
);

export default systemModule;
