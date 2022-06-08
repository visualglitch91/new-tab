import { ComponentChildren } from "preact";
import { HassEntity } from "home-assistant-js-websocket";
import Paper from "./Paper";
import EntityRow from "./EntityRow";
import EntitiesSwitch from "./EntitiesSwitch";
import "./ListCard.css";

export type Row =
  | {
      type?: "entity" | undefined;
      entityId: string;
      icon?: string;
      label?: string;
      renderContent?: (entity: HassEntity) => ComponentChildren;
    }
  | {
      type: "divider";
    }
  | { type: "custom"; render: () => ComponentChildren };

export default function ListCard({
  class: className,
  title,
  rows,
  showGroupSwitch,
}: {
  class?: string;
  title?: string;
  rows: Row[];
  showGroupSwitch?: boolean;
}) {
  function renderRow(row: Row) {
    switch (row.type) {
      case undefined:
      case "entity":
        return <EntityRow {...row} />;
      case "divider":
        return <div class="component__list-card-row__divider" />;
      case "custom":
        return row.render();
      default:
        return null;
    }
  }

  const groupedEntityIds = rows
    .filter((it) => {
      return (
        "entityId" in it &&
        ["light", "switch", "input_boolean"].includes(
          it.entityId?.split(".")[0]
        )
      );
    })
    .map((it) => "entityId" in it && it.entityId) as string[];

  return (
    <Paper class={className}>
      {Boolean(title) && (
        <div class="component__list-card__header">
          <h2>{title}</h2>
          {showGroupSwitch && Boolean(groupedEntityIds.length) && (
            <EntitiesSwitch entityIds={groupedEntityIds} />
          )}
        </div>
      )}
      <div class="component__list-card__content">{rows.map(renderRow)}</div>
    </Paper>
  );
}
