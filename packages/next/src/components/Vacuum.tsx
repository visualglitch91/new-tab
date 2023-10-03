import { ButtonGroup, Button, List, Stack } from "@mui/material";
import { makeServiceCall, useEntity } from "../utils/hass";
import ListItem from "./ListItem";
import RunScriptButton from "./RunScriptButton";
import EntitiesSwitch from "./EntitiesSwitch";
import EntityListItem from "./EntityListItem";
import Icon from "./Icon";
import GlossyPaper from "./GlossyPaper";

const vacuumId = "vacuum.mi_robot_vacuum_mop_p";

const statusLabels = {
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

function VacuumActionsRow() {
  const vacuum = useEntity(vacuumId);
  const state = vacuum?.state;

  if (state && ["docked", "idle"].includes(state)) {
    const clean = (
      <ListItem
        icon="mdi:robot-vacuum"
        primaryText="Aspirar áreas selecionadas"
        endSlot={
          <RunScriptButton entityId="script.vacuum_clean_selected_zones">
            Aspirar
          </RunScriptButton>
        }
      />
    );

    if (state === "docked") {
      return clean;
    }

    return (
      <>
        {clean}
        <ListItem
          icon="mdi:robot-vacuum"
          primaryText="Retornar para a base"
          endSlot={
            <Button onClick={makeVacuumCall("return_to_base")}>Retornar</Button>
          }
        />
      </>
    );
  }

  return (
    <ButtonGroup>
      <Button
        startIcon={<Icon icon="mdi:play" />}
        onClick={makeVacuumCall("start")}
      >
        Continuar
      </Button>
      <Button
        startIcon={<Icon icon="mdi:pause" />}
        onClick={makeVacuumCall("pause")}
      >
        Pausar
      </Button>
      <Button
        startIcon={<Icon icon="mdi:stop" />}
        onClick={makeVacuumCall("stop")}
      >
        Parar
      </Button>
      <Button
        startIcon={<Icon icon="mdi:home" />}
        onClick={makeVacuumCall("return_to_base")}
      >
        Retornar
      </Button>
    </ButtonGroup>
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

export default function Vacuum() {
  return (
    <Stack spacing={3}>
      <List component={GlossyPaper}>
        <EntityListItem
          label="Status"
          entityId={vacuumId}
          renderListContent={(entity) => {
            const status = entity.attributes
              .status as keyof typeof statusLabels;
            return statusLabels[status] || "Desconhecido";
          }}
        />

        <EntityListItem
          label="Bateria"
          icon="battery-50"
          entityId={vacuumId}
          renderListContent={(entity) => `${entity.attributes.battery_level}%`}
        />
        <VacuumActionsRow />
      </List>
      <List component={GlossyPaper}>
        {[
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
        ].map((props, index) => (
          <EntityListItem {...props} key={index} />
        ))}
      </List>
    </Stack>
  );
}
