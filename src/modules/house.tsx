import { formatNumericValue } from "../utils/general";
import { TVEntityButton } from "../components/TVEntityButton";
import { ComponentGroupProps } from "../utils/typings";
import ComponentGroup from "../components/ComponentGroup";
import LightGroupEntityButton from "../components/LightGroupEntityButton";

const groups: ComponentGroupProps[] = [
  {
    title: "Sala",
    showGroupSwitch: true,
    extraGroupSwitchEntityIds: [
      "light.sala_rgb_tv",
      "light.sala_rgb_rack",
      "light.sala_rgb_sofa",
    ],
    layout: "grid",
    items: [
      { entityId: "switch.mesa_jantar_luz", label: "Luz da Mesa" },
      { entityId: "light.sala_luz", label: "Luz da Sala" },
      "switch.sala_luminaria",
      "switch.sala_ventilador",
      <LightGroupEntityButton
        label="RGB"
        entityIds={[
          "light.sala_rgb_tv",
          "light.sala_rgb_rack",
          "light.sala_rgb_sofa",
        ]}
      />,
      {
        hiddenOnDesktop: true,
        element: <TVEntityButton icon="mdi:television-classic" label="TV" />,
      },
      {
        hiddenOnDesktop: true,
        changeTimeout: 30_000,
        entityId: "switch.sala_receiver",
        ignoreOnGroupSwitch: true,
      },
    ],
  },
  {
    title: "Escritório",
    showGroupSwitch: true,
    extraGroupSwitchEntityIds: [
      "light.escritorio_rgb",
      "light.escritorio_rgb_2",
    ],
    layout: "grid",
    items: [
      "switch.escritorio_luz",
      "light.escritorio_luminaria",
      <LightGroupEntityButton
        label="RGB"
        entityIds={["light.escritorio_rgb", "light.escritorio_rgb_2"]}
      />,
      "switch.escritorio_ventilador",
    ],
  },
  {
    title: "Cozinha e Lavanderia",
    showGroupSwitch: true,
    layout: "grid",
    items: [
      { entityId: "switch.cozinha_luz", label: "Luz da\nCozinha" },
      { entityId: "switch.lavanderia_luz", label: "Luz da\nLavanderia" },
      { entityId: "switch.lavanderia_banheiro", label: "Luz do\nBanheiro" },
    ],
  },
  {
    title: "Quarto",
    showGroupSwitch: true,
    extraGroupSwitchEntityIds: [
      "switch.quarto_abajur_esquerdo",
      "switch.quarto_abajur_direito",
    ],
    layout: "grid",
    items: [
      "switch.quarto_luz",
      "switch.quarto_ventilador",
      <LightGroupEntityButton
        label="Abajures"
        icon="mdi-outdoor-lamp"
        entityIds={[
          "switch.quarto_abajur_esquerdo",
          "switch.quarto_abajur_direito",
        ]}
      />,
      { entityId: "switch.sacada_luz", label: "Sacada" },
      { entityId: "switch.quarto_umidificador", ignoreOnGroupSwitch: true },
      { entityId: "switch.quarto_aquecedor", ignoreOnGroupSwitch: true },
    ],
  },
  {
    title: "Banheiro",
    layout: "grid",
    items: [
      "switch.banheiro_luz",
      "light.banheiro_luz_chuveiro",
      {
        entityId: "script.banheiro_luz_quente_no_chuveiro",
        label: "Luz Quente\nno Chuveiro",
      },
    ],
  },
  {
    title: "Casa",
    layout: "grid",
    items: [
      "switch.cameras",
      "switch.impressora_3d",
      "script.casa_apagar_todas_luzes",
      {
        entityId: "script.casa_apagar_todas_luzes_menos_sala",
        label: "Somente Luz\nda Sala",
      },
      "script.sala_firetv_reiniciar",
      "script.encontrar_celular_lais",
      "script.encontrar_celular_erica_1",
      "script.encontrar_celular_erica_2",
    ],
  },
  {
    title: "Sistema",
    layout: "list",
    items: [
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
        label: "Ventoinha",
        entityId: "sensor.processor_fan_speed",
        renderListContent: (entity) => `${entity.state} RPM`,
      },
      {
        label: "Memória",
        entityId: "sensor.memory_use_percent",
        renderListContent: (entity) => formatNumericValue(entity.state, "%"),
      },
    ],
  },
];

const houseModule = groups.map((props, index) => (
  <ComponentGroup key={index} {...props} />
));

export default houseModule;
