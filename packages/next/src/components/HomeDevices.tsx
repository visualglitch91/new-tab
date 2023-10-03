import { SxProps } from "@mui/material";
import EntityButton, { EntityButtonProps } from "./EntityButton";
import GridSection from "./GridSection";

const groups: { title: string; items: EntityButtonProps[] }[] = [
  {
    title: "Sala",
    items: [
      { entityId: "switch.mesa_jantar_luz", label: "Luz da Mesa" },
      { entityId: "light.sala_luz", label: "Luz da Sala" },
      { entityId: "switch.sala_luminaria" },
      { entityId: "switch.sala_ventilador" },
      { entityId: "switch.sala_ambilight" },
      { entityId: "light.sala_rgb_tv" },
      { entityId: "light.sala_rgb_rack" },
      {
        entityId: "cover.sala_cortina",
        changeTimeout: 30_000,
        icon: "curtains",
      },
      // <TVEntityButton />,
    ],
  },
  {
    title: "Escritório",
    items: [
      { entityId: "switch.escritorio_luz" },
      { entityId: "switch.escritorio_alto_falantes", changeTimeout: 9_000 },
      { entityId: "light.escritorio_luminaria" },
      { entityId: "light.escritorio_rgb_mesa" },
      { entityId: "light.escritorio_rgb_quadro" },
      { entityId: "switch.escritorio_ventilador" },
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
      { entityId: "switch.quarto_aquecedor" },
    ],
  },
  {
    title: "Banheiro",
    items: [
      { entityId: "light.banheiro_luz" },
      { entityId: "light.banheiro_luz_chuveiro" },
      {
        entityId: "script.banheiro_luz_quente_no_chuveiro",
        label: "Luz Quente\nno Chuveiro",
      },
    ],
  },
  {
    title: "Casa",
    items: [
      { entityId: "input_boolean.casa_ignorar_interfone" },
      {
        entityId: "switch.impressora_3d_servidor",
        changeTimeout: 40_000,
        label: "Impressora 3D",
      },
      { entityId: "script.casa_apagar_todas_luzes" },
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
      { entityId: "script.encontrar_celular_lais" },
      { entityId: "script.encontrar_celular_erica_1" },
      { entityId: "script.encontrar_celular_erica_2" },
    ],
  },
];

const favorites: EntityButtonProps[] = [
  { entityId: "switch.mesa_jantar_luz", label: "Luz da Mesa" },
  { entityId: "light.sala_luz", label: "Luz da Sala" },
  { entityId: "switch.escritorio_luz", label: "Luz do\nEscritório" },
  { entityId: "light.quarto_luz", label: "Luz do Quarto" },
  { entityId: "switch.cozinha_luz", label: "Luz da\nCozinha" },
  { entityId: "switch.lavanderia_luz", label: "Luz da\nLavanderia" },
];

const favoriteIconSize = "28px";

const favoriteSx: SxProps = {
  flexDirection: "row",
  justifyContent: "flex-start",
  height: "58px",
  px: "18px",
  "& > i": {
    fontSize: `${favoriteIconSize} !important`,
    minWidth: `${favoriteIconSize} !important`,
    maxWidth: `${favoriteIconSize} !important`,
    minHeight: `${favoriteIconSize} !important`,
    maxHeight: `${favoriteIconSize} !important`,
  },
  "& > i+div": {
    fontSize: "12px",
    fontWeight: 600,
  },
};

const renderItem = (sx?: SxProps) => (it: EntityButtonProps) =>
  <EntityButton key={it.entityId} {...it} sx={sx} />;

export default function HomeDevices({ slice = [] }: { slice?: number[] }) {
  return (
    <>
      <GridSection columnWidth={100} gap={8}>
        {favorites.map(renderItem(favoriteSx))}
      </GridSection>
      {groups.slice(...slice).map((group, index) => (
        <GridSection key={index} title={group.title}>
          {group.items.map(renderItem())}
        </GridSection>
      ))}
    </>
  );
}
