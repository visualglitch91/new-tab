import { useEffect } from "react";
import { keyBy } from "lodash";
import { Stack, Switch, Button } from "@mui/material";
import { removeItemAtIndex } from "$client/utils/array";
import useModal from "$client/utils/useModal";
import { useHassStore } from "$client/utils/hass";
import AltIconButton from "./AltIconButton";
import EntitySelectorDialog, { formatEntity } from "./EntitySelectorDialog";

interface SimpleAction {
  on: boolean;
  entityId: string;
}

const validDomains = [
  "light",
  "switch",
  "media_player",
  "curtain",
  "script",
  "climate",
];

export default function ActionsForm({
  value: actions,
  onChange,
}: {
  value: SimpleAction[];
  onChange: (value: SimpleAction[]) => void;
}) {
  const mount = useModal();
  const store = useHassStore();

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

  function selectEntity(index: number) {
    const selected = actions[index].entityId;

    mount((_, props) => (
      <EntitySelectorDialog
        {...props}
        maxSelected={1}
        defaultValue={selected ? [selected] : []}
        validDomains={validDomains}
        onSelect={([entityId]) => {
          if (!entityId) {
            return;
          }

          setActionField(index, "entityId", entityId);
        }}
      />
    ));
  }

  const entitiesById = keyBy(store.states.map(formatEntity), "id");

  return (
    <>
      {actions.map((it, index) => {
        const lastItem = index === actions.length - 1;
        const entity = entitiesById[it.entityId];

        return (
          <Stack key={index} direction="row" alignItems="center" spacing="12px">
            <Switch
              checked={it.on}
              onChange={(_, checked) => {
                setActionField(index, "on", checked);
              }}
            />
            <Button fullWidth onClick={() => selectEntity(index)}>
              {entity
                ? `(${entity.zone}) ${entity.name}`
                : "Selecionar entidade"}
            </Button>
            <AltIconButton
              icon={lastItem ? "plus" : "minus"}
              onClick={() => (lastItem ? addAction() : removeAction(index))}
            />
          </Stack>
        );
      })}
    </>
  );
}
