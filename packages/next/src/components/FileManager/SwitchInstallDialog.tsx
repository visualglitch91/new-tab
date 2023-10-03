import { useState } from "react";
import api from "../../utils/api";
import useMountEffect from "../../utils/useMountEffect";
import ShellOutputDialog from "../../components/ShellOutputDialog";
import { DialogBaseControlProps } from "../DialogBase";
import { File } from "./utils";

function getPath(file: File) {
  return [...file.ancestors.slice(1), file].map((it) => it.name).join("/");
}

export default function SwitchInstallDialog({
  file,
  ...props
}: {
  file: File;
} & DialogBaseControlProps) {
  const [processId, setProcessId] = useState<string>();

  useMountEffect(() => {
    api<{ processId: string }>("/file-manager/install-switch", "post", {
      paths: [getPath(file)],
    }).then((res) => setProcessId(res.processId));
  });

  if (!processId) {
    return null;
  }

  return (
    <ShellOutputDialog
      {...props}
      size={{ width: 1280, height: 720 }}
      processId={processId}
      title="Installing"
    />
  );
}
