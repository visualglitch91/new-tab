import { formatNumericValue } from "../utils/general";
import ComponentGroup from "../components/ComponentGroup";

export default function Batteries() {
  return (
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
  );
}
