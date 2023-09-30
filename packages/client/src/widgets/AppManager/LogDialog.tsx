import { useState } from "react";
import useMountEffect from "../../utils/useMountEffect";
import api from "../../utils/api";
import ShellOutputDialog from "../../components/ShellOutputDialog";
import { ParsedApp } from "./utils";

export default function LogDialog({
  app,
  onClose,
}: {
  app: ParsedApp;
  onClose: () => void;
}) {
  const [processId, setProcessId] = useState<string>();

  useMountEffect(() => {
    api<{ processId: string }>(
      `/app-manager/${app.type}/${app.rawName}/logs`,
      "get"
    ).then((res) => setProcessId(res.processId));
  });

  if (!processId) {
    return null;
  }

  return (
    <ShellOutputDialog
      processId={processId}
      title={app.name}
      onClose={onClose}
    />
  );
}
