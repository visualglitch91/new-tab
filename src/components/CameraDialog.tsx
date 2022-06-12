import CameraStream from "./CameraStream";
import DialogBase from "./DialogBase";

export default function CameraDialog({
  entityId,
  onClose,
}: {
  entityId: string;
  onClose: () => void;
}) {
  return (
    <DialogBase title="Câmera" onClose={onClose}>
      <CameraStream
        style={{ width: "80vw", maxWidth: 600 }}
        entityId={entityId}
      />
    </DialogBase>
  );
}
