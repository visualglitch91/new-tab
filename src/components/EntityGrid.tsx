import Paper from "./Paper";
import EntityButton from "./EntityButton";
import EntitiesSwitch from "./EntitiesSwitch";
import "./EntityGrid.css";
import { Row } from "./ListCard";

export default function EntityGrid({
  title,
  rows,
  showGroupSwitch,
}: {
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
        return <EntityButton {...row} />;
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
    <div>
      {Boolean(title) && (
        <Paper class="component__entity-grid__header">
          <h2>{title}</h2>
          {showGroupSwitch && Boolean(groupedEntityIds.length) && (
            <EntitiesSwitch entityIds={groupedEntityIds} />
          )}
        </Paper>
      )}
      <div class="component__entity-grid__content">{rows.map(renderRow)}</div>
    </div>
  );
}
