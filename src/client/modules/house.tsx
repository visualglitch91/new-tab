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
      "switch.sala_ambilight",
      "light.sala_rgb_tv",
      "light.sala_rgb_rack",
      {
        entityId: "cover.sala_cortina",
        changeTimeout: 30_000,
        icon: "curtains",
      },
      {
        hiddenOnDesktop: true,
        element: <TVEntityButton />,
      },
      // {
      //   hiddenOnDesktop: true,
      //   changeTimeout: 30_000,
      //   entityId: "switch.sala_receiver",
      //   ignoreOnGroupSwitch: true,
      // },
    ],
  },
  {
    title: "Escritório",
    showGroupSwitch: true,
    layout: "grid",
    items: [
      "switch.escritorio_luz",
      { entityId: "switch.escritorio_alto_falantes", changeTimeout: 9_000 },
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
      "light.quarto_luz",
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
      "light.banheiro_luz",
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
      {
        entityId: "switch.impressora_3d_servidor",
        changeTimeout: 40_000,
        label: "Impressora 3D",
      },
      "script.casa_apagar_todas_luzes",
      {
        entityId: "script.casa_apagar_todas_luzes_menos_sala",
        label: "Somente Luz\nda Sala",
      },
      {
        entityId: "script.computador_erica_desligar_monitor",
        confirmBefore: true,
        label: "Desligar Monitor Erica",
      },
      {
        entityId: "script.computador_erica_suspender",
        confirmBefore: true,
        label: "Suspender Computador Erica",
      },
      {
        entityId: "script.computador_erica_reiniciar",
        confirmBefore: true,
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
