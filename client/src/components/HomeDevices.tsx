import { Fragment } from "react/jsx-runtime";
import EntityButton, { EntityButtonProps } from "./EntityButton";
import GridSection from "./GridSection";
import HVAC from "./HVAC";
import TV from "./TV";
import Printers from "./Printers";

const groups: (
  | {
      title?: string;
      prepend?: React.ReactNode;
      horizontal?: boolean;
      items: EntityButtonProps[];
    }
  | { element: React.ReactNode }
)[] = [
  {
    items: [
      { entityId: "switch.mesa_jantar_luz", label: "Luz da Mesa" },
      { entityId: "light.sala_luz", label: "Luz da Sala" },
      { entityId: "light.escritorio_luz", label: "Luz do\nEscritório" },
      { entityId: "light.quarto_luz", label: "Luz do Quarto" },
      { entityId: "switch.cozinha_luz", label: "Luz da\nCozinha" },
      { entityId: "switch.lavanderia_luz", label: "Luz da\nLavanderia" },
      { entityId: "light.banheiro_luz", label: "Luz do\nBanheiro" },
    ],
    prepend: <TV />,
  },
  {
    title: "Sala",
    prepend: <HVAC />,
    items: [
      { entityId: "switch.mesa_jantar_luz", label: "Luz da Mesa" },
      { entityId: "light.sala_luz", label: "Luz da Sala" },
      { entityId: "switch.sala_luminaria" },
      { entityId: "switch.sala_ventilador" },
      { entityId: "light.sala_rgb_tv" },
      { entityId: "light.sala_rgb_rack" },
      { entityId: "cover.sala_cortina", icon: "curtains" },
    ],
  },
  {
    title: "Escritório",
    items: [
      { entityId: "light.escritorio_luz" },
      {
        entityId: "switch.computador_avell_alto_falantes",
        changeTimeout: 9_000,
      },
      { entityId: "light.escritorio_luminaria" },
      { entityId: "light.escritorio_apoio_headphone" },
      { entityId: "light.escritorio_rgb_mesa" },
      { entityId: "light.escritorio_rgb_quadro" },
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
      // { entityId: "switch.quarto_umidificador" },
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
      },
    ],
  },
  { title: "Impressoras", items: [], prepend: <Printers /> },
  {
    title: "Outros",
    horizontal: true,
    items: [
      { entityId: "input_boolean.casa_ignorar_interfone" },
      { entityId: "button.casa_apagar_todas_luzes" },
      {
        entityId: "button.casa_apagar_todas_luzes_menos_sala",
        label: "Somente Luz da Sala",
      },
      {
        entityId: "button.erica_avell_suspender",
        confirmBefore: true,
        label: "Suspender Computador",
      },
      {
        entityId: "button.erica_avell_reiniciar",
        confirmBefore: true,
        label: "Reiniciar Computador",
      },
      {
        entityId: "button.encontrar_celular_erica_1",
        label: "Encontrar Celular",
      },
    ],
  },
];

const horizontalSectionProps = {
  columnWidth: 140,
  gap: 8,
};

export default function HomeDevices({ slice = [] }: { slice?: number[] }) {
  return (
    <>
      {groups.slice(...slice).map((group, index) => {
        if ("element" in group) {
          return <Fragment key={index}>{group.element}</Fragment>;
        }

        return (
          <GridSection
            key={index}
            title={group.title}
            prepend={group.prepend}
            {...(group.horizontal ? horizontalSectionProps : {})}
          >
            {group.items.map((it) => (
              <EntityButton
                {...it}
                key={it.entityId}
                horizontal={group.horizontal}
              />
            ))}
          </GridSection>
        );
      })}
    </>
  );
}
