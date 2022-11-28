import DialogBase from "./DialogBase";
import EntityListItem from "./EntityListItem";

export default function LightGroupDialog({
  title,
  entityIds,
  onClose,
}: {
  title: string;
  entityIds: string[];
  onClose: () => void;
}) {
  return (
    <DialogBase title={title} onClose={onClose}>
      {entityIds.map((entityId) => (
        <EntityListItem key={entityId} entityId={entityId} />
      ))}
    </DialogBase>
  );
}
