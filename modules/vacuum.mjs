import { h } from "../utils/preact.mjs";
import { css } from "../utils/general.mjs";
import { makeServiceCall, useHass } from "../utils/hass.mjs";
import ListCard from "../components/ListCard.mjs";
import PillButton from "../components/PillButton.mjs";
import ListCardRow from "../components/ListCardRow.mjs";
import RunScriptButton from "../components/RunScriptButton.mjs";
import Button from "../components/Button.mjs";
import EntitiesSwitch from "../components/EntitiesSwitch.mjs";

const vacuumId = "vacuum.mi_robot_vacuum_mop_p";

css(`
  .module__vacuum__pills {
    display: flex;
    column-gap: 8px;
    justify-content: center;
  }
`);

const statusLabels = {
  cleaning: "Limpando",
  docked: "Na Base",
  paused: "Pausado",
  idle: "Parado",
  returning: "Voltando",
  error: "Erro",
};

function makeVacuumCall(action) {
  return makeServiceCall("vacuum", action, { entity_id: vacuumId });
}

function VacuumActionsRow() {
  const { states } = useHass();
  const vacuum = states[vacuumId];

  if (["docked", "idle"].includes(vacuum.state)) {
    const clean = h`
      <${ListCardRow} icon="mdi:robot-vacuum" label="Aspirar áreas selecionadas">
        <${RunScriptButton} label="Aspirar" entityId="script.vacuum_clean_selected_zones" />
      </${ListCardRow}>`;

    if (vacuum.state === "docked") {
      return clean;
    }

    return h`
      ${clean}
      <${ListCardRow} icon="mdi:robot-vacuum" label="Retornar para a base">
        <${Button} onClick=${makeVacuumCall("return_to_base")}>
          Retornar
        </${Button}>
      </${ListCardRow}>
    `;
  }

  return h`
    <div class="module__vacuum__pills">
      <${PillButton}
        icon="mdi:play"
        label="Continuar"
        onClick=${makeVacuumCall("start")}
      />
      <${PillButton}
        icon="mdi:pause"
        label="Pausar"
        onClick=${makeVacuumCall("pause")}
      />
      <${PillButton}
        icon="mdi:stop"
        label="Parar"
        onClick=${makeVacuumCall("stop")}
      />
      <${PillButton}
        icon="mdi:home"
        label="Retornar"
        onClick=${makeVacuumCall("return_to_base")}
      />
    </div>`;
}

const booleanInputs = [
  { label: "Cozinha", entityId: "input_boolean.vacuum_cozinha" },
  { label: "Sala Jantar", entityId: "input_boolean.vacuum_sala_jantar" },
  { label: "Sala Estar", entityId: "input_boolean.vacuum_sala_estar" },
  { label: "Escritório", entityId: "input_boolean.vacuum_escritorio" },
  { label: "Banheiro", entityId: "input_boolean.vacuum_banheiro" },
  { label: "Quarto", entityId: "input_boolean.vacuum_quarto" },
];

const rows = [
  {
    label: "Status",
    entityId: vacuumId,
    renderContent: (entity) =>
      statusLabels[entity.attributes.status]?.toUpperCase(),
  },
  {
    type: "custom",
    render: () => h`<${VacuumActionsRow} />`,
  },
  { type: "divider" },
  {
    label: "Todos",
    entityId: vacuumId,
    renderContent: () =>
      h`<${EntitiesSwitch}
          condition="every"
          entityIds=${booleanInputs.map((it) => it.entityId)}
        />`,
  },
  ...booleanInputs,
];

const vacuumModule = h`
  <${ListCard} title="Aspirador" rows=${rows} />
`;

export default vacuumModule;
