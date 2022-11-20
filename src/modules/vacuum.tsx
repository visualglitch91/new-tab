import { makeServiceCall, useHass } from "../utils/hass";
import ListCard from "../components/ListCard";
import PillButton from "../components/PillButton";
import ListCardRow from "../components/ListCardRow";
import RunScriptButton from "../components/RunScriptButton";
import Button from "../components/Button";
import EntitiesSwitch from "../components/EntitiesSwitch";
import FlexRow from "../components/FlexRow";

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
  const { states } = useHass();
  const vacuum = states[vacuumId];

  if (["docked", "idle"].includes(vacuum.state)) {
    const clean = (
      <ListCardRow icon="mdi:robot-vacuum" label="Aspirar áreas selecionadas">
        <RunScriptButton
          label="Aspirar"
          entityId="script.vacuum_clean_selected_zones"
        />
      </ListCardRow>
    );

    if (vacuum.state === "docked") {
      return clean;
    }

    return (
      <>
        {clean}
        <ListCardRow icon="mdi:robot-vacuum" label="Retornar para a base">
          <Button onTap={makeVacuumCall("return_to_base")}>Retornar</Button>
        </ListCardRow>
      </>
    );
  }

  return (
    <FlexRow>
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

export default (
  <ListCard
    title="Aspirador"
    rows={[
      {
        label: "Status",
        entityId: vacuumId,
        renderContent: (entity) => {
          const status = entity.attributes.status as keyof typeof statusLabels;
          return statusLabels[status]?.toUpperCase();
        },
      },
      {
        type: "custom",
        render: () => <VacuumActionsRow />,
      },
      { type: "divider" },
      {
        label: "Todos",
        entityId: vacuumId,
        renderContent: () => (
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
