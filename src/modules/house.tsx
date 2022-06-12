import { makeTurnOnCall } from "../utils/hass";
import Switch from "../components/Switch";
import ListCard, { Row } from "../components/ListCard";
import RunScriptButton from "../components/RunScriptButton";
import EntitiesSwitch from "../components/EntitiesSwitch";
import { formatNumericValue } from "../utils/general";

const groups: Record<string, { title: string; rows: Row[] }> = {
  living_room: {
    title: "Sala",
    rows: [
      { label: "Luz da Mesa", entityId: "switch.sala_luz_mesa" },
      { label: "Luz da Sala", entityId: "switch.sala_luz" },
      { label: "Luminária", entityId: "switch.sala_luminaria" },
      { label: "RGB TV", entityId: "light.sala_rgb_tv" },
      { label: "RGB Rack", entityId: "light.sala_rgb_rack" },
    ],
  },
  office: {
    title: "Escritório",
    rows: [
      { label: "Luz", entityId: "switch.escritorio_luz" },
      { label: "Ventilador", entityId: "switch.escritorio_ventilador" },
      // { label: "Luz Ambiente", entityId: "light.escritorio_rgb" },
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
        renderContent: (entity) => formatNumericValue(entity.state, "%"),
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
      { label: "Sacada", entityId: "switch.sacada_luz" },
    ],
  },
  bathroom: {
    title: "Banheiro",
    rows: [
      {
        label: "Luzes",
        entityId: "switch.banheiro_luz",
        renderContent: () => (
          <EntitiesSwitch
            entityIds={["switch.banheiro_luz", "light.banheiro_luz_chuveiro"]}
          />
        ),
      },
      {
        icon: "shower-head",
        label: "Luz do Chuveiro",
        entityId: "light.banheiro_luz_chuveiro",
        renderContent: () => (
          <RunScriptButton
            label="Luz Quente"
            entityId="script.banheiro_luz_quente_no_chuveiro"
          />
        ),
      },
    ],
  },
  shortcuts: {
    title: "Atalhos",
    rows: [
      {
        label: "Impressora 3D",
        entityId: "switch.impressora_3d",
        renderContent: (entity) =>
          entity.state === "on" ? (
            "Ligada"
          ) : (
            <Switch
              checked={false}
              onInput={makeTurnOnCall("switch.impressora_3d")}
            />
          ),
      },
      {
        entityId: "script.casa_apagar_todas_luzes",
        label: "Apagar todas as luzes",
        renderContent: (entity) => (
          <RunScriptButton entityId={entity.entity_id} />
        ),
      },
      {
        entityId: "script.casa_apagar_todas_luzes_menos_sala",
        label: "Apagar luzes, menos da sala",
        renderContent: (entity) => (
          <RunScriptButton entityId={entity.entity_id} />
        ),
      },
      {
        entityId: "script.quarto_iluminacao_abajures",
        label: "Iluminação abajures",
        renderContent: (entity) => (
          <RunScriptButton entityId={entity.entity_id} />
        ),
      },
    ],
  },
  systemMonitor: {
    title: "Sistema",
    rows: [
      {
        icon: "fa-thermometer-three-quarters",
        label: "Temperatura",
        entityId: "sensor.processor_temperature",
        renderContent: (entity) => formatNumericValue(entity.state, "°C"),
      },
      {
        label: "Processador",
        entityId: "sensor.processor_use",
        renderContent: (entity) => formatNumericValue(entity.state, "%"),
      },
      {
        label: "Memória",
        entityId: "sensor.memory_use_percent",
        renderContent: (entity) => formatNumericValue(entity.state, "%"),
      },
    ],
  },
};

export default [
  <ListCard key={1} showGroupSwitch {...groups.living_room} />,
  <ListCard key={2} showGroupSwitch {...groups.office} />,
  <ListCard key={3} showGroupSwitch {...groups.kitchen} />,
  <ListCard key={4} showGroupSwitch {...groups.bedroom} />,
  <ListCard key={5} {...groups.bathroom} />,
  <ListCard key={6} {...groups.systemMonitor} />,
  <ListCard key={7} {...groups.shortcuts} />,
];
