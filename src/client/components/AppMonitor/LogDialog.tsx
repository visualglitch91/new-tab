import { ParsedApp } from "./utils";
import DialogBase from "../DialogBase";
import useProcessRunner from "../../utils/useProcessRunner";
import useMountEffect from "../../utils/useMountEffect";
import { useState } from "react";
import api from "../../utils/api";

export default function LogDialog({
  app,
  onClose,
}: {
  app: ParsedApp;
  onClose: () => void;
}) {
  const [processId, setProcessId] = useState<string>();
  const { shellOutput } = useProcessRunner(processId);

  useMountEffect(() => {
    api<{ processId: string }>(
      `/app-manager/${app.type}/${app.rawName}/logs`,
      "get"
    ).then((res) => setProcessId(res.processId));
  });

  return (
    <DialogBase
      sx={{
        width: "100vw",
        height: "100vh",
        maxWidth: "unset",
        maxHeight: "unset",
        borderRadius: 0,
      }}
      contentSx={(theme) => ({
        height: "100%",
        [theme.breakpoints.down("sm")]: { px: 0, pb: 0 },
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      })}
      title="Logs"
      closeButtonOnMobile
      onClose={onClose}
    >
      {shellOutput}
    </DialogBase>
  );
}
