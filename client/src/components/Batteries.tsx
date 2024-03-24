import { HassEntity } from "home-assistant-js-websocket";
import { mergeWith } from "$client/utils/array";
import { formatNumericValue } from "$client/utils/general";
import { EntityListItems } from "./EntityListItem";
import ListSection from "./ListSection";

export default function Batteries() {
  return (
    <ListSection title="Baterias">
      <EntityListItems
        items={[
          {
            entityId: "sensor.lavanderia_tanque_bateria",
            label: "Sensor do Tanque",
          },
          {
            entityId: "sensor.banheiro_porta_do_escritorio_bateria",
            label: "Sensor da Porta do Banheiro/Escritório",
          },
          {
            entityId: "sensor.banheiro_porta_do_quarto_bateria",
            label: "Sensor da Porta do Banheiro/Quarto",
          },
          {
            entityId: "sensor.sala_porta_bateria",
            label: "Sensor da Porta da Sala",
          },
        ].map(
          mergeWith({
            icon: "battery-50",
            renderListContent: (entity: HassEntity) =>
              formatNumericValue(entity.state, "%", 0),
          })
        )}
      />
    </ListSection>
  );
}
