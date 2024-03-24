import { useState } from "react";
import useMountEffect from "$client/utils/useMountEffect";
import api from "$client/utils/api";
import ShellOutputDialog from "../ShellOutputDialog";
import { ParsedApp } from "./utils";
import { DialogBaseControlProps } from "../DialogBase";

export default function LogDialog({
  app,
  ...props
}: { app: ParsedApp } & DialogBaseControlProps) {
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
    <ShellOutputDialog {...props} processId={processId} title={app.name} />
  );
}
