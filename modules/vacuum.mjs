import { h } from "../utils/preact.mjs";
import { css } from "../utils/general.mjs";
import { useHass } from "../utils/hass.mjs";
import ListCard from "../components/ListCard.mjs";
import PillButton from "../components/PillButton.mjs";
import ListCardRow from "../components/ListCardRow.mjs";
import RunScriptButton from "../components/RunScriptButton.mjs";

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
  docked: "Estacionado",
  paused: "Pausado",
  idle: "Parado",
  returning: "Voltando",
  error: "Erro",
};

function VacuumActionsRow() {
  const { states } = useHass();
  const vacuum = states[vacuumId];

  if (["docked", "idle"].includes(vacuum.state)) {
    return h`
      <${ListCardRow} icon="mdi:robot-vacuum" label="Aspirar áreas selecionadas">
        <${RunScriptButton} label="Aspirar" entityId="script.vacuum_clean_selected_zones" />
      </${ListCardRow}>`;
  }

  const serviceData = { entity_id: vacuumId };

  return h`
    <div class="module__vacuum__pills">
      <${PillButton}
        icon="mdi:play"
        label="Continuar"
        onClick=${makeServiceCall("vacuum", "start", serviceData)}
      />
      <${PillButton}
        icon="mdi:pause"
        label="Pausar"
        onClick=${makeServiceCall("vacuum", "pause", serviceData)}
      />
      <${PillButton}
        icon="mdi:stop"
        label="Parar"
        onClick=${makeServiceCall("vacuum", "stop", serviceData)}
      />
      <${PillButton}
        icon="mdi:home"
        label="Retornar"
        onClick=${makeServiceCall("vacuum", "return_to_base", serviceData)}
      />
    </div>`;
}

const rows = [
  {
    label: "Status",
    entityId: vacuumId,
    renderContent: (entity) => statusLabels[entity.attributes.status],
  },
  {
    type: "custom",
    render: () => h`<${VacuumActionsRow} />`,
  },
  { type: "divider" },
  { label: "Cozinha", entityId: "input_boolean.vacuum_cozinha" },
  { label: "Sala Jantar", entityId: "input_boolean.vacuum_sala_jantar" },
  { label: "Sala Estar", entityId: "input_boolean.vacuum_sala_estar" },
  { label: "Escritório", entityId: "input_boolean.vacuum_escritorio" },
  { label: "Banheiro", entityId: "input_boolean.vacuum_banheiro" },
  { label: "Quarto", entityId: "input_boolean.vacuum_quarto" },
];

const vacuumModule = h`
  <${ListCard} title="Aspirador" rows=${rows} />
`;

export default vacuumModule;
