import { Button, List, Stack, Divider } from "@mui/material";
import { makeServiceCall, useEntity } from "$app/utils/hass";
import ListItem from "./ListItem";
import RunScriptButton from "./RunScriptButton";
import EntitiesSwitch from "./EntitiesSwitch";
import { EntityListItems } from "./EntityListItem";
import GlossyPaper from "./GlossyPaper";
import AltIconButton from "./AltIconButton";

const vacuumId = "vacuum.mi_robot_vacuum_mop_p";

const statusLabels: Record<string, string> = {
  cleaning: "Limpando",
  docked: "Na Base",
  paused: "Pausado",
  idle: "Parado",
  returning: "Voltando",
  error: "Erro",
};

function makeVacuumCall(action: string) {
  return makeServiceCall("vacuum", action, { entity_id: vacuumId });
}

function VacuumActionsRow({ label }: { label: string }) {
  const vacuum = useEntity(vacuumId);
  const state = vacuum?.state || "error";
  const battery = vacuum?.attributes.battery_level || null;

  return (
    <ListItem
      icon="mdi:robot-vacuum"
      primaryText={label}
      secondaryText={[
        statusLabels[state] || statusLabels.error,
        battery === null ? false : `${battery}%`,
      ]
        .filter(Boolean)
        .join(" - ")}
      endSlot={
        state === "idle" ? (
          <Button size="small" onClick={makeVacuumCall("return_to_base")}>
            Retornar
          </Button>
        ) : state === "docked" ? (
          <RunScriptButton
            size="small"
            entityId="button.casa_aspirar_areas_selecionadas"
          >
            Aspirar
          </RunScriptButton>
        ) : (
          <Stack direction="row" gap={1}>
            <AltIconButton
              size={24}
              icon="mdi:play"
              onClick={makeVacuumCall("start")}
            />
            <AltIconButton
              size={24}
              icon="mdi:pause"
              onClick={makeVacuumCall("pause")}
            />
            <AltIconButton
              size={24}
              icon="mdi:stop"
              onClick={makeVacuumCall("stop")}
            />
            <AltIconButton
              size={24}
              icon="mdi:home"
              onClick={makeVacuumCall("return_to_base")}
            />
          </Stack>
        )
      }
    />
  );
}

const booleanInputs = [
  { label: "Cozinha", entityId: "input_boolean.vacuum_cozinha" },
  { label: "Sala Jantar", entityId: "input_boolean.vacuum_sala_jantar" },
  { label: "Sala Estar", entityId: "input_boolean.vacuum_sala_estar" },
  { label: "Escritório", entityId: "input_boolean.vacuum_escritorio" },
  { label: "Banheiro", entityId: "input_boolean.vacuum_banheiro" },
  { label: "Quarto", entityId: "input_boolean.vacuum_quarto" },
];

export default function Vacuum({ label = "Aspirador" }: { label?: string }) {
  return (
    <List component={GlossyPaper}>
      <VacuumActionsRow label={label} />
      <Divider />
      <EntityListItems
        items={[
          {
            label: "Todos",
            entityId: vacuumId,
            renderListContent: () => (
              <EntitiesSwitch
                condition="every"
                entityIds={booleanInputs.map((it) => it.entityId)}
              />
            ),
          },
          ...booleanInputs,
        ]}
      />
    </List>
  );
}
