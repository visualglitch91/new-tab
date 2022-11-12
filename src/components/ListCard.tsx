import { ComponentChildren } from "preact";
import { HassEntity } from "home-assistant-js-websocket";
import Paper from "./Paper";
import EntityRow from "./EntityRow";
import EntitiesSwitch from "./EntitiesSwitch";
import "./ListCard.css";

export type Row =
  | {
      type?: "entity" | undefined;
      hidden?: boolean;
      entityId: string;
      icon?: string;
      label?: string;
      ignoreOnGroupSwitch?: boolean;
      changeTimeout?: number;
      renderContent?: (entity: HassEntity) => ComponentChildren;
    }
  | {
      type: "divider";
      hidden?: boolean;
    }
  | {
      type: "custom";
      hidden?: boolean;
      render: () => ComponentChildren;
    };

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
    if (row.hidden) {
      return null;
    }

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
        !it.ignoreOnGroupSwitch &&
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
