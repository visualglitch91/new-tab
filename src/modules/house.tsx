import { makeTurnOnCall } from "../utils/hass";
import Switch from "../components/Switch";
import ListCard, { Row } from "../components/ListCard";
import EntityGrid from "../components/EntityGrid";
import RunScriptButton from "../components/RunScriptButton";
import EntitiesSwitch from "../components/EntitiesSwitch";
import { formatNumericValue, isDesktop } from "../utils/general";
import ListCardRow from "../components/ListCardRow";
import { TVEntitySwitch } from "../components/TVEntitySwitch";
import { TVEntityButton } from "../components/TVEntityButton";

function scriptRow(it: {
  entityId: string;
  label?: string;
  buttonLabel?: string;
  icon?: string;
}) {
  return {
    ...it,
    renderContent: () => (
      <RunScriptButton label={it.buttonLabel} entityId={it.entityId} />
    ),
  };
}

const groups: Record<string, { title: string; rows: Row[] }> = {
  living_room: {
    title: "Sala",
    rows: [
      { label: "Luz da Mesa", entityId: "switch.sala_luz_mesa" },
      { label: "Luz da Sala", entityId: "switch.sala_luz" },
      { label: "Luminária", entityId: "switch.sala_luminaria" },
      {
        label: "RGB TV",
        hidden: isDesktop,
        entityId: "light.sala_rgb_tv",
      },
      {
        label: "RGB Rack",
        hidden: isDesktop,
        entityId: "light.sala_rgb_rack",
      },

      { type: "divider", hidden: isDesktop },
      {
        type: "custom",
        hidden: isDesktop,
        render: () => {
          const icon = "mdi:television-classic";
          const label = "TV";

          if (isDesktop) {
            return (
              <ListCardRow icon={icon} label={label}>
                <TVEntitySwitch />
              </ListCardRow>
            );
          }

          return <TVEntityButton icon={icon} label={label} />;
        },
      },
      {
        label: "Surround",
        icon: "mdi:surround-sound",
        hidden: isDesktop,
        changeTimeout: 30_000,
        entityId: "switch.sala_receiver",
        ignoreOnGroupSwitch: true,
      },
    ],
  },
  office: {
    title: "Escritório",
    rows: [
      { label: "Luz", entityId: "switch.escritorio_luz" },
      { label: "Luminária", entityId: "light.escritorio_luminaria" },
      { label: "RGB Mesa", entityId: "light.escritorio_rgb" },
      { label: "RGB Quadro", entityId: "light.escritorio_rgb_2" },
      { label: "Ventilador", entityId: "switch.escritorio_ventilador" },
    ],
  },
  kitchen: {
    title: "Cozinha e Lavanderia",
    rows: [
      { label: "Luz da Cozinha", entityId: "switch.cozinha_luz" },
      { label: "Luz da Lavanderia", entityId: "switch.lavanderia_luz" },
      { label: "Luz do Banheiro", entityId: "switch.lavanderia_banheiro" },
    ],
  },
  bedroom: {
    title: "Quarto",
    rows: [
      { label: "Luz", entityId: "switch.quarto_luz" },
      { label: "Ventilador", entityId: "switch.quarto_ventilador" },
      { label: "Abajur Direito", entityId: "switch.quarto_abajur_direito" },
      { label: "Abajur Esquerdo", entityId: "switch.quarto_abajur_esquerdo" },
      { label: "Sacada", entityId: "switch.sacada_luz" },
      { label: "Umidificador", entityId: "switch.quarto_umidificador" },
      { label: "Aquecedor", entityId: "switch.quarto_aquecedor" },
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
      {
        icon: "shower-head",
        hidden: isDesktop,
        label: "Luz Quente no Chuveiro",
        entityId: "script.banheiro_luz_quente_no_chuveiro",
      },
    ],
  },
  shortcuts: {
    title: "Atalhos",
    rows: [
      {
        label: "Impressora 3D",
        icon: "mdi-printer-3d-nozzle",
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
      ...[
        {
          label: "Apagar todas as luzes",
          entityId: "script.casa_apagar_todas_luzes",
        },
        {
          label: "Apagar luzes, menos da sala",
          entityId: "script.casa_apagar_todas_luzes_menos_sala",
        },
        {
          label: "Iluminação abajures",
          entityId: "script.quarto_iluminacao_abajures",
        },
      ].map(scriptRow),
    ],
  },
  mobilePhones: {
    title: "Celulares",
    rows: [
      {
        label: "Lais",
        buttonLabel: "Encontrar",
        entityId: "script.encontrar_celular_lais",
      },
      {
        label: "Erica",
        buttonLabel: "Encontrar",
        entityId: "script.encontrar_celular_erica_1",
      },
      {
        label: "Erica 2",
        buttonLabel: "Encontrar",
        entityId: "script.encontrar_celular_erica_2",
      },
    ].map(scriptRow),
  },
  systemMonitor: {
    title: "Sistema",
    rows: [
      {
        icon: "icofont-thermometer",
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

let key = 0;

export default [
  <EntityGrid key={key++} showGroupSwitch {...groups.living_room} />,
  <EntityGrid key={key++} showGroupSwitch {...groups.office} />,
  <EntityGrid key={key++} showGroupSwitch {...groups.kitchen} />,
  <EntityGrid key={key++} showGroupSwitch {...groups.bedroom} />,
  <EntityGrid key={key++} {...groups.bathroom} />,
  <ListCard key={key++} {...groups.mobilePhones} />,
  <ListCard key={key++} {...groups.shortcuts} />,
  <ListCard key={key++} {...groups.systemMonitor} />,
];
