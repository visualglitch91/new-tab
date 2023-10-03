import { orderBy } from "lodash";
import { Fragment, useEffect } from "react";
import {
  Stack,
  Select,
  Switch,
  ListSubheader,
  MenuItem,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useHassStore } from "../utils/hass";
import Icon from "./Icon";
import AltIconButton from "./AltIconButton";
import { removeItemAtIndex } from "../utils/array";

interface SimpleAction {
  on: boolean;
  entityId: string;
}

const validDomains = ["light", "switch", "media_player", "curtain", "script"];

function parseOption(name: string): [string, string] {
  const pattern = /^\[(.*?)\] (.*)$/;
  const match = name.match(pattern);

  if (match && match.length === 3) {
    const zone = match[1];
    const entityName = match[2];
    return [zone, entityName];
  }

  return ["Outros", name];
}

export default function ActionsForm({
  value: actions,
  onChange,
}: {
  value: SimpleAction[];
  onChange: (value: SimpleAction[]) => void;
}) {
  const store = useHassStore();

  const entities = orderBy(
    store.states
      .filter((entity) =>
        validDomains.some((domain) => entity.entity_id.startsWith(`${domain}.`))
      )
      .map((it) => {
        const [zone, name] = parseOption(it.attributes!.friendly_name!);
        const domain = it.entity_id.split(".")[0];

        return {
          id: it.entity_id,
          name,
          zone: domain === "script" ? "Scripts" : zone,
        };
      })
      .filter((it) => it.zone !== "Base"),
    ["zone", "name"],
    ["asc", "asc"]
  );

  console.log(entities);

  const groupedEntities = (() => {
    // type EntityOption = (typeof entities)[number] & { zone: string };
    // const tmp: Record<string, EntityOption[]> = {};
    // const push = (group: string, option: EntityOption) => {
    //   if (!tmp[group]) {
    //     tmp[group] = [];
    //   }
    //   tmp[group].push(option);
    // };
    // entities.forEach((entity) => {
    //   if (entity.id.startsWith("script.")) {
    //     push("Scripts", { ...entity, zone: "Scripts" });
    //     return;
    //   }
    //   const [zone, name] = parseOption(entity.name);
    //   if (zone !== "Base") {
    //     push(zone, { id: entity.id, name, zone });
    //   }
    // });
    // const { Scripts, Outros, ...rest } = tmp;
    // const groups = orderBy(Object.entries(rest), ["0"], ["asc"]);
    // groups.push(["Scripts", Scripts]);
    // groups.push(["Outros", Outros]);
    // return groups;
  })();

  useEffect(() => {
    if (actions.length === 0) {
      onChange([{ on: true, entityId: "" }]);
    }
    //eslint-disable-next-line
  }, []);

  function setActionField<K extends keyof SimpleAction>(
    index: number,
    key: K,
    value: SimpleAction[K]
  ) {
    const next = [...actions];
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  }

  function addAction() {
    onChange([...actions, { on: true, entityId: "" }]);
  }

  function removeAction(index: number) {
    onChange(removeItemAtIndex(actions, index));
  }

  return (
    <>
      {actions.map((it, index) => {
        const lastItem = index === actions.length - 1;

        return (
          <Stack key={index} direction="row" alignItems="center" spacing="12px">
            <Switch
              checked={it.on}
              onChange={(_, checked) => {
                setActionField(index, "on", checked);
              }}
            />
            {/* <Select
              sx={{ width: "100%" }}
              value={it.entityId}
              renderValue={(option) => {
                return option
                  ? `(${option.props["data-zone"]}) ${option.props.children}`
                  : null;
              }}
              onChange={(_, option) => {
                console.log(option.props.value);
                if (option.props.value) {
                  setActionField(index, "entityId", option.props.value);
                }
              }}
            >
              {groupedEntities.flatMap(([zone, entities]) => [
                <ListSubheader key={`zone-${zone}`}>
                  {zone} ({entities.length})
                </ListSubheader>,
                ...entities.map((it) => (
                  <MenuItem key={it.id} value={it.id} data-zone={it.zone}>
                    {it.name}
                  </MenuItem>
                )),
              ])}
            </Select> */}
            <Autocomplete
              id="grouped-demo"
              options={entities}
              groupBy={(option) => option.zone}
              getOptionLabel={(option) => option.name}
              sx={{ width: "100%" }}
              renderInput={(params) => <TextField {...params} />}
            />
            <AltIconButton
              onClick={() => (lastItem ? addAction() : removeAction(index))}
            >
              {lastItem ? (
                <Icon size={24} icon="plus" />
              ) : (
                <Icon size={24} icon="minus" />
              )}
            </AltIconButton>
          </Stack>
        );
      })}
    </>
  );
}
