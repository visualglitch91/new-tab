import { h } from "../utils/preact.mjs";
import { makeTurnOnCall } from "../utils/hass.mjs";
import Stack from "../components/Stack.mjs";
import Switch from "../components/Switch.mjs";
import ListCard from "../components/ListCard.mjs";
import RunScriptButton from "../components/RunScriptButton.mjs";
import SidebarToggleRow from "../components/SidebarToggleRow.mjs";

const groups = {
  living_room: {
    title: "Sala",
    rows: [
      { label: "Luz da Mesa", entityId: "switch.sala_luz_mesa" },
      { label: "Luz da Sala", entityId: "switch.sala_luz" },
      { label: "Luminária", entityId: "switch.sala_luminaria" },
      { label: "Luz Ambiente", entityId: "light.sala_luz_ambiente" },
    ],
  },
  office: {
    title: "Escritório",
    rows: [
      { label: "Luz", entityId: "switch.escritorio_luz" },
      { label: "Ventilador", entityId: "switch.escritorio_ventilador" },
      { label: "Luz Ambiente", entityId: "light.escritorio_rgb" },
    ],
  },
  kitchen: {
    title: "Cozinha e Lavanderia",
    rows: [
      { label: "Luz da Cozinha", entityId: "switch.cozinha_luz" },
      { label: "Luz da Lavanderia", entityId: "switch.lavanderia_luz" },
      {
        icon: "mdi:water",
        label: "Bateria do Sensor de Vazamento",
        entityId: "sensor.water_leak_sensor_battery",
        renderContent: (entity) => `${Math.floor(Number(entity.state))}%`,
      },
    ],
  },
  bedroom: {
    title: "Quarto",
    rows: [
      { label: "Aquecedor", entityId: "switch.quarto_aquecedor" },
      { label: "Umidificador", entityId: "switch.quarto_umidificador" },
      { label: "Ventilador", entityId: "switch.quarto_ventilador" },
      { label: "Luz", entityId: "switch.quarto_luz" },
      { label: "Abajur Esquerdo", entityId: "switch.quarto_abajur_esquerdo" },
      { label: "Abajur Direito", entityId: "switch.quarto_abajur_direito" },
      { label: "Banheiro", entityId: "switch.banheiro_luz" },
      { label: "Sacada", entityId: "switch.sacada_luz" },
    ],
  },
  shortcuts: {
    title: "Atalhos",
    rows: [
      {
        label: "Impressora 3D",
        entityId: "switch.impressora_3d",
        renderContent: (entity) =>
          entity.state === "on"
            ? "Ligada"
            : h`<${Switch}
                  checked=${false}
                  onInput=${makeTurnOnCall("switch.impressora_3d")}
                />`,
      },
      {
        entityId: "script.casa_apagar_todas_luzes",
        label: "Apagar todas as luzes",
        renderContent: (entity) =>
          h`<${RunScriptButton} entityId=${entity.entity_id} />`,
      },
      {
        entityId: "script.casa_apagar_todas_luzes_menos_sala",
        label: "Apagar todas as luzes, menos da sala",
        renderContent: (entity) =>
          h`<${RunScriptButton} entityId=${entity.entity_id} />`,
      },
      {
        entityId: "script.quarto_iluminacao_abajures",
        label: "Iluminação abajures",
        renderContent: (entity) =>
          h`<${RunScriptButton} entityId=${entity.entity_id} />`,
      },
      {
        type: "custom",
        render:()=> h`<${SidebarToggleRow} />`
      }
    ],
  },
};

const houseModule = h`
  <${Stack}>
    <${ListCard} ...${groups.living_room} />
    <${ListCard} ...${groups.office} />
    <${ListCard} ...${groups.kitchen} />
  </${Stack}>
  <${Stack}>
    <${ListCard} ...${groups.bedroom} />
    <${ListCard} ...${groups.shortcuts} />
  </${Stack}>
`;

export default houseModule;
