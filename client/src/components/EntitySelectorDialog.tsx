import { orderBy } from "lodash";
import { HassEntity } from "home-assistant-js-websocket";
import { useSet } from "@uidotdev/usehooks";
import { Box, Button, Stack, Typography, styled } from "@mui/material";
import { useHassStore } from "$client/utils/hass";
import DialogBase, { DialogBaseControlProps } from "./DialogBase";
import Grid from "./Grid";

// eslint-disable-next-line react-refresh/only-export-components
export function formatEntity(entity: HassEntity): {
  id: string;
  name: string;
  zone: string;
  domain: string;
} {
  const id = entity.entity_id;
  const friendlyName = entity.attributes?.friendly_name;
  const domain = id.split(".")[0];

  if (domain === "script") {
    return {
      id,
      name: friendlyName || entity.entity_id,
      zone: "Scripts",
      domain,
    };
  }

  if (friendlyName) {
    const pattern = /^\[(.*?)\] (.*)$/;
    const match = friendlyName.match(pattern);

    if (match && match.length === 3) {
      const zone = match[1];
      const name = match[2];

      return {
        id,
        name,
        zone,
        domain,
      };
    }

    return {
      id,
      name: friendlyName,
      zone: "Outros",
      domain,
    };
  }

  return {
    id,
    domain,
    name: entity.entity_id,
    zone: "Outros",
  };
}

const EntityItem = styled(Button)({
  textTransform: "unset",
});

export default function EntitySelectorDialog({
  validDomains,
  defaultValue,
  onSelect,
  maxSelected = Infinity,
  ...props
}: {
  validDomains: string[];
  defaultValue?: string[];
  maxSelected?: number;
  onSelect: (entityIds: string[]) => void;
} & DialogBaseControlProps) {
  const store = useHassStore();
  const selected = useSet<string>(defaultValue);
  const entities = orderBy(
    store.states
      .filter((it) => it.state !== "unavailable")
      .filter((entity) =>
        validDomains.some((domain) => entity.entity_id.startsWith(`${domain}.`))
      )
      .map(formatEntity),
    ["name"],
    ["asc"]
  );

  const groupedEntities = (() => {
    type EntityOption = (typeof entities)[number] & { zone: string };

    const tmp: Record<string, EntityOption[]> = {};
    const push = (group: string, option: EntityOption) => {
      if (!tmp[group]) {
        tmp[group] = [];
      }

      tmp[group].push(option);
    };

    entities.forEach((entity) => {
      if (entity.domain === "script.") {
        push("Scripts", entity);
        return;
      }

      if (entity.zone !== "Base") {
        push(entity.zone, entity);
      }
    });

    const { Scripts, Outros, ...rest } = tmp;
    const groups = orderBy(Object.entries(rest), ["0"], ["asc"]);

    groups.push(["Scripts", Scripts]);
    groups.push(["Outros", Outros]);

    return groups;
  })();

  function submit(values: string[]) {
    onSelect(values);
    props.onClose();
  }

  return (
    <DialogBase
      {...props}
      dividers
      title="Escolher entidade"
      bottomMobileSheet
      sx={(theme) => ({
        "& .MuiDialog-paper": {
          [theme.breakpoints.up("sm")]: {
            width: "50vw",
            maxWidth: "700px",
          },
        },
        "& .MuiDialogContent-root": {
          textAlign: "left",
          height: "70vh",
          width: "100%",
        },
      })}
      footer={
        <>
          <Button onClick={props.onClose}>Cancelar</Button>
          {maxSelected > 1 && (
            <Button onClick={() => submit(Array.from(selected))}>
              Continuar
            </Button>
          )}
        </>
      }
    >
      <Stack spacing={3}>
        {groupedEntities.map(([zone, entities]) => (
          <Box
            key={zone}
            borderBottom="1px solid rgba(100,100,100,0.5)"
            paddingBottom={4}
          >
            <Typography marginBottom={1} fontWeight={500}>
              {zone}
            </Typography>
            <Grid gap={16} columnWidth={120}>
              {entities.map((it) => (
                <EntityItem
                  size="small"
                  variant={selected.has(it.id) ? "contained" : "outlined"}
                  onClick={() => {
                    if (selected.has(it.id)) {
                      selected.delete(it.id);
                    } else if (maxSelected === 1) {
                      setTimeout(submit, 150, [it.id]);
                    } else if (Array.from(selected).length < maxSelected) {
                      selected.add(it.id);
                    }
                  }}
                >
                  {it.name}
                </EntityItem>
              ))}
            </Grid>
          </Box>
        ))}
      </Stack>
    </DialogBase>
  );
}
