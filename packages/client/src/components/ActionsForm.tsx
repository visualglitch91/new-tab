import { Fragment, useEffect } from "react";
import {
  List,
  ListItem,
  ListDivider,
  Option,
  Select,
  Typography,
} from "@mui/joy";
import { useHassStore } from "../utils/hass";
import { compareByStringProp, removeItemAtIndex } from "../utils/array";
import BorderButton from "./BorderButton";
import FlexRow from "./FlexRow";
import Switch from "./Switch";
import Icon from "./Icon";

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

  const entities = store.states
    .filter((entity) =>
      validDomains.some((domain) => entity.entity_id.startsWith(`${domain}.`))
    )
    .map((it) => ({
      id: it.entity_id,
      name: it.attributes.friendly_name || it.entity_id,
    }))
    .sort(compareByStringProp("name"));

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
      if (entity.id.startsWith("script.")) {
        push("Scripts", { ...entity, zone: "Scripts" });
        return;
      }

      const [zone, name] = parseOption(entity.name);

      if (zone !== "Base") {
        push(zone, { id: entity.id, name, zone });
      }
    });

    const { Scripts, Outros, ...rest } = tmp;
    const groups = Object.entries(rest).sort(compareByStringProp("0"));

    groups.push(["Scripts", Scripts]);
    groups.push(["Outros", Outros]);

    return groups;
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
          <FlexRow key={index} full sx={{ alignItems: "center", gap: "12px" }}>
            <Switch
              checked={it.on}
              onChange={(e) => {
                setActionField(index, "on", e.currentTarget.checked);
              }}
            />
            <Select
              sx={{ width: "100%" }}
              value={it.entityId}
              renderValue={(option) => {
                return option
                  ? `(${option.ref.current?.getAttribute("data-zone")}) ${
                      option.label
                    }`
                  : null;
              }}
              onChange={(_, value) => {
                if (value) {
                  setActionField(index, "entityId", value);
                }
              }}
            >
              {groupedEntities.map(([zone, entities], index) => (
                <Fragment key={zone}>
                  {index !== 0 && <ListDivider role="none" />}
                  <List
                    aria-labelledby={`select-group-${zone}`}
                    sx={{ "--ListItemDecorator-size": "28px" }}
                  >
                    <ListItem id={`select-group-${zone}`} sticky>
                      <Typography level="body-xs" textTransform="uppercase">
                        {zone} ({entities.length})
                      </Typography>
                    </ListItem>
                    {entities.map((it) => (
                      <Option key={it.id} value={it.id} data-zone={it.zone}>
                        {it.name}
                      </Option>
                    ))}
                  </List>
                </Fragment>
              ))}
            </Select>
            <BorderButton
              sx={{ borderRadius: "100%", width: "24px", height: "24px" }}
              onClick={() => (lastItem ? addAction() : removeAction(index))}
            >
              {lastItem ? <Icon icon="plus" /> : <Icon icon="minus" />}
            </BorderButton>
          </FlexRow>
        );
      })}
    </>
  );
}
