import { Fragment } from "react/jsx-runtime";
import Printers from "./Printers";
import GridSection, { GridSectionProps } from "./GridSection";
import EntityTileCard, { EntityTileCardProps } from "./EntityTileCard";
import HVACTileCard from "./HVACTileCard";
import TVTileCard from "./TVTileCard";

const groups: (
  | {
      title?: string;
      prepend?: React.ReactNode;
      items: (
        | GridSectionProps["items"][number]
        | (EntityTileCardProps & { size?: number })
        | string
      )[];
    }
  | { element: React.ReactNode }
)[] = [
  {
    title: "Casa",
    items: [
      {
        element: <TVTileCard />,
        size: 12,
      },
      {
        element: <HVACTileCard entityId="climate.ar_condicionado" />,
        size: 12,
      },
      { entityId: "select.sala_ambilight" },
      { entityId: "switch.mesa_jantar_luz", label: "Luz da Mesa" },
      { entityId: "light.sala_luz", label: "Luz da Sala" },
      { entityId: "light.escritorio_luz", label: "Luz do\nEscritório" },
      { entityId: "light.quarto_luz", label: "Luz do Quarto" },
      { entityId: "switch.cozinha_luz", label: "Luz da\nCozinha" },
      { entityId: "switch.lavanderia_luz", label: "Luz da\nLavanderia" },
      { entityId: "light.banheiro_luz", label: "Luz do\nBanheiro" },
    ],
    //prepend: <TV />,
  },
  {
    title: "Sala",
    //prepend: <HVAC />,
    items: [
      { entityId: "switch.mesa_jantar_luz", label: "Luz da Mesa" },
      { entityId: "light.sala_luz", label: "Luz da Sala" },
      { entityId: "switch.sala_luminaria" },
      { entityId: "switch.sala_ventilador" },
      { entityId: "light.sala_rgb_tv", icon: "led-strip-variant" },
      { entityId: "light.sala_rgb_rack", icon: "led-strip-variant" },
      { entityId: "cover.sala_cortina", icon: "curtains" },
    ],
  },
  {
    title: "Escritório",
    items: [
      { entityId: "light.escritorio_luz" },
      { entityId: "light.escritorio_luminaria", icon: "desk-lamp" },
      { entityId: "light.escritorio_apoio_headphone" },
      { entityId: "light.escritorio_rgb_mesa", icon: "led-strip-variant" },
      { entityId: "light.escritorio_rgb_quadro" },
      {
        entityId: "button.computador_avell_suspender",
        confirmBefore: "off" as const,
        label: "Suspender PC",
        icon: "mdi-sleep",
      },
      {
        entityId: "button.computador_avell_reiniciar",
        confirmBefore: "off" as const,
        label: "Reiniciar PC",
        icon: "restart",
      },
    ],
  },
  {
    title: "Cozinha e Lavanderia",
    items: [
      { entityId: "switch.cozinha_luz", label: "Luz da\nCozinha" },
      { entityId: "switch.cozinha_cafeteira" },
      { entityId: "switch.lavanderia_luz", label: "Luz da\nLavanderia" },
      { entityId: "switch.lavanderia_banheiro", label: "Luz do\nBanheiro" },
    ],
  },
  {
    title: "Quarto",
    items: [
      { entityId: "light.quarto_luz" },
      { entityId: "switch.quarto_ventilador" },
      { entityId: "switch.quarto_abajur_esquerdo" },
      { entityId: "switch.quarto_abajur_direito" },
      { entityId: "switch.sacada_luz", label: "Sacada" },
      { entityId: "switch.quarto_umidificador" },
      // { entityId: "switch.quarto_aquecedor" },
    ],
  },
  {
    title: "Banheiro",
    items: [
      { entityId: "light.banheiro_luz" },
      { entityId: "light.banheiro_luz_chuveiro" },
      {
        entityId: "button.banheiro_luz_quente_no_chuveiro",
        label: "Luz Quente\nno Chuveiro",
        icon: "shower-head",
        size: 12,
      },
    ],
  },
  {
    title: "Outros",
    items: [
      { entityId: "input_boolean.casa_ignorar_interfone" },
      {
        entityId: "button.casa_estou_saindo",
        icon: "location-exit",
      },
      {
        entityId: "button.casa_cheguei",
        icon: "location-enter",
      },
      { entityId: "input_boolean.casa_automacoes_cachorrinhos" },
      {
        entityId: "button.casa_apagar_todas_luzes",
        icon: "lightbulb-group-off-outline",
      },
      {
        entityId: "button.casa_apagar_todas_luzes_menos_sala",
        label: "Somente Luz da Sala",
        icon: "lightbulb-group-off-outline",
      },
      // {
      //   entityId: "input_button.sidekick_lab_encontrar_celular_erica_1",
      //   label: "Encontrar Celular",
      // },
    ],
  },
  { title: "Impressoras", items: [], prepend: <Printers /> },
];

export default function HomeDevices({
  slice = [],
  hideFirstGroupTitle,
}: {
  slice?: number[];
  hideFirstGroupTitle?: boolean;
}) {
  return (
    <>
      {groups.slice(...slice).map((group, index) => {
        if ("element" in group) {
          return <Fragment key={index}>{group.element}</Fragment>;
        }

        return (
          <div key={index} title={group.title}>
            <GridSection
              defaultSize={6}
              title={
                hideFirstGroupTitle && index === 0 ? undefined : group.title
              }
              prepend={group.prepend}
              items={group.items.map((it) => {
                const item = typeof it === "string" ? { entityId: it } : it;

                if ("entityId" in item) {
                  return {
                    element: <EntityTileCard {...item} />,
                    size: item.size,
                  };
                }

                return item;
              })}
            />
          </div>
        );
      })}
    </>
  );
}
