import { TVEntityButton } from "../components/TVEntityButton";
import { ComponentGroupProps } from "../utils/typings";
import ComponentGroup from "../components/ComponentGroup";

const groups: ComponentGroupProps[] = [
  {
    title: "Sala",
    showGroupSwitch: true,
    layout: "grid",
    items: [
      { entityId: "switch.mesa_jantar_luz", label: "Luz da Mesa" },
      { entityId: "light.sala_luz", label: "Luz da Sala" },
      "switch.sala_luminaria",
      "switch.sala_ventilador",
      "light.sala_rgb_tv",
      "light.sala_rgb_rack",
      { entityId: "cover.sala_cortina", changeTimeout: 30_000 },
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
    layout: "grid",
    items: [
      "switch.escritorio_luz",
      { entityId: "switch.office_speakers", changeTimeout: 9_000 },
      "light.escritorio_luminaria",
      "light.escritorio_rgb_mesa",
      "light.escritorio_rgb_quadro",
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
    layout: "grid",
    items: [
      "switch.quarto_luz",
      "switch.quarto_ventilador",
      "switch.quarto_abajur_esquerdo",
      "switch.quarto_abajur_direito",
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
      { entityId: "switch.impressora_3d", changeTimeout: 40_000 },
      "script.casa_apagar_todas_luzes",
      {
        entityId: "script.casa_apagar_todas_luzes_menos_sala",
        label: "Somente Luz\nda Sala",
      },
      {
        entityId: "script.computador_erica_suspender",
        label: "Suspender Computador Erica",
      },
      {
        entityId: "script.computador_erica_reiniciar",
        label: "Reiniciar Computador Erica",
      },
      "script.encontrar_celular_lais",
      "script.encontrar_celular_erica_1",
      "script.encontrar_celular_erica_2",
    ],
  },
];

const houseModule = groups.map((props, index) => (
  <ComponentGroup key={index} {...props} />
));

export default houseModule;
