import { makeServiceCall, useEntity } from "../utils/hass";
import PillButton from "../components/PillButton";
import ListItem from "../components/ListItem";
import RunScriptButton from "../components/RunScriptButton";
import Button from "../components/Button";
import EntitiesSwitch from "../components/EntitiesSwitch";
import FlexRow from "../components/FlexRow";
import ComponentGroup from "../components/ComponentGroup";

const vacuumId = "vacuum.mi_robot_vacuum_mop_p";

const statusLabels = {
  cleaning: "Limpando",
  docked: "Na Base",
  paused: "Pausado",
  idle: "Parado",
  returning: "Voltando",
  error: "Erro",
};

function makeVacuumCall(action: string) {
  return makeServiceCall("vacuum", action, { entity_id: vacuumId });
}

function VacuumActionsRow() {
  const vacuum = useEntity(vacuumId);
  const state = vacuum?.state;

  if (state && ["docked", "idle"].includes(state)) {
    const clean = (
      <ListItem icon="mdi:robot-vacuum" label="Aspirar áreas selecionadas">
        <RunScriptButton
          label="Aspirar"
          entityId="script.vacuum_clean_selected_zones"
        />
      </ListItem>
    );

    if (state === "docked") {
      return clean;
    }

    return (
      <>
        {clean}
        <ListItem icon="mdi:robot-vacuum" label="Retornar para a base">
          <PillButton
            onClick={makeVacuumCall("return_to_base")}
            label="Retornar"
          />
        </ListItem>
      </>
    );
  }

  return (
    <FlexRow wrap>
      <PillButton
        icon="mdi:play"
        label="Continuar"
        onClick={makeVacuumCall("start")}
      />
      <PillButton
        icon="mdi:pause"
        label="Pausar"
        onClick={makeVacuumCall("pause")}
      />
      <PillButton
        icon="mdi:stop"
        label="Parar"
        onClick={makeVacuumCall("stop")}
      />
      <PillButton
        icon="mdi:home"
        label="Retornar"
        onClick={makeVacuumCall("return_to_base")}
      />
    </FlexRow>
  );
}

const booleanInputs = [
  { label: "Cozinha", entityId: "input_boolean.vacuum_cozinha" },
  { label: "Sala Jantar", entityId: "input_boolean.vacuum_sala_jantar" },
  { label: "Sala Estar", entityId: "input_boolean.vacuum_sala_estar" },
  { label: "Escritório", entityId: "input_boolean.vacuum_escritorio" },
  { label: "Banheiro", entityId: "input_boolean.vacuum_banheiro" },
  { label: "Quarto", entityId: "input_boolean.vacuum_quarto" },
];

export default function Vacuum() {
  return (
    <ComponentGroup
      layout="list"
      title="Aspirador"
      items={[
        {
          label: "Status",
          entityId: vacuumId,
          renderListContent: (entity) => {
            const status = entity.attributes
              .status as keyof typeof statusLabels;
            return statusLabels[status] || "Desconhecido";
          },
        },
        {
          label: "Bateria",
          icon: "battery-50",
          entityId: vacuumId,
          renderListContent: (entity) => `${entity.attributes.battery_level}%`,
        },
        <VacuumActionsRow />,
        "divider",
        {
          label: "Todos",
          entityId: vacuumId,
          renderListContent: () => (
            <EntitiesSwitch
              condition="every"
              entityIds={booleanInputs.map((it) => it.entityId)}
            />
          ),
        },
        ...booleanInputs,
      ]}
    />
  );
}
