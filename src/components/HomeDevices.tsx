import { Fragment } from "react";
import { Divider } from "@mui/material";
import GridSection, { GridSectionProps } from "./GridSection";
import EntityTileCard, { EntityTileCardProps } from "./EntityTileCard";
import HVACTileCard from "./HVACTileCard";
import TVTileCard from "./TVTileCard";

const largeCard = { xs: 12, sm: 8, md: 6, xl: 4 };

const groups: {
  title?: string;
  prepend?: React.ReactNode;
  items: (
    | GridSectionProps["items"][number]
    | (EntityTileCardProps & { size?: number })
    | string
  )[];
}[] = [
  {
    title: "Casa",
    items: [
      {
        element: (
          <HVACTileCard
            statusEntityId="input_text.casa_ar_condicionado_status"
            turnOffButtonEntityId="button.casa_ar_condicionado_desligar"
            getButtonEntityId={(speed, temp) => {
              return `button.casa_ar_condicionado_${temp}_${speed}`;
            }}
          />
        ),
        size: largeCard,
      },
      // { entityId: "select.sala_ambilight" },
      { entityId: "light.mesa_jantar_luz", label: "Luz da Mesa" },
      { entityId: "light.sala_luz", label: "Luz da Sala" },
      { entityId: "light.escritorio_luz", label: "Luz do\nEscritório" },
      { entityId: "light.quarto_luz", label: "Luz do Quarto" },
      { entityId: "light.cozinha_luz", label: "Luz da\nCozinha" },
      { entityId: "light.lavanderia_luz", label: "Luz da\nLavanderia" },
      { entityId: "light.casa_luz_do_hall" },
      { entityId: "light.casa_luz_do_corredor" },
    ],
  },
  {
    title: "Sala",
    items: [
      {
        element: (
          <TVTileCard
            entityId="media_player.sala_tv"
            remoteId="remote.base_sala_androidtv"
          />
        ),
        size: largeCard,
      },
      { entityId: "light.mesa_jantar_luz", label: "Luz da Mesa" },
      { entityId: "light.sala_luz", label: "Luz da Sala" },
      { entityId: "light.escritorio_luz", label: "Luz do\nEscritório" },
      { entityId: "light.banheiro_2_luz", label: "Luz do\nBanheiro" },
      // { entityId: "light.sala_rgb_tv", icon: "led-strip-variant" },
      // { entityId: "light.sala_rgb_rack", icon: "led-strip-variant" },
    ],
  },
  // {
  //   title: "Escritório",
  //   items: [
  //     { entityId: "light.escritorio_luminaria", icon: "desk-lamp" },
  //     { entityId: "light.escritorio_apoio_headphone" },
  //     { entityId: "light.escritorio_rgb_mesa", icon: "led-strip-variant" },
  //     { entityId: "light.escritorio_rgb_quadro" },
  //   ],
  // },
  {
    title: "Cozinha e Lavanderia",
    items: [
      { entityId: "light.cozinha_luz", label: "Luz da\nCozinha" },
      { entityId: "switch.cozinha_cafeteira" },
      { entityId: "light.lavanderia_luz", label: "Luz da\nLavanderia" },
    ],
  },
  {
    title: "Quarto",
    items: [
      {
        element: (
          <TVTileCard
            entityId="media_player.quarto_tv"
            remoteId="remote.base_quarto_androidtv"
          />
        ),
        size: largeCard,
      },
      { entityId: "light.quarto_luz" },
      { entityId: "switch.quarto_ventilador" },
      { entityId: "light.banheiro_1_luz" },
      { entityId: "light.banheiro_1_luz_chuveiro" },
      // { entityId: "switch.quarto_abajur_esquerdo" },
      // { entityId: "switch.quarto_abajur_direito" },
      // { entityId: "switch.sacada_luz", label: "Sacada" },
      // { entityId: "switch.quarto_umidificador" },
      { entityId: "switch.quarto_aquecedor" },
    ],
  },
  {
    title: "Oficina",
    items: [
      { entityId: "light.oficina_luz" },
      {
        entityId: "switch.impressora_s1_servidor",
        label: "Creality Ender-3 S1",
        confirmBefore: "off",
      },
      {
        entityId: "switch.impressora_k1_servidor",
        label: "Creality K1",
        confirmBefore: "off",
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
];

export default function HomeDevices({
  slice = [],
  dividers,
  hideFirstGroupTitle,
}: {
  slice?: number[];
  dividers?: boolean;
  hideFirstGroupTitle?: boolean;
}) {
  return (
    <>
      {groups.slice(...slice).map((group, index) => {
        return (
          <Fragment key={index}>
            <GridSection
              defaultSize={{ xs: 6, sm: 4, md: 3, xl: 2 }}
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
            {dividers && index < groups.length - 1 && <Divider />}
          </Fragment>
        );
      })}
    </>
  );
}
