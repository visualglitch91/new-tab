import { useState } from "react";
import { File } from "./utils";
import useTextHTTPStream from "../../utils/useTextHTTPStream";
import DialogBase from "../../components/DialogBase";
import useMountEffect from "../../utils/useMountEffect";
import api from "../../utils/api";

function getPath(file: File) {
  return [...file.ancestors.slice(1), file].map((it) => it.name).join("/");
}

export default function SwitchInstallDialog({
  file,
  onClose,
}: {
  file: File;
  onClose: () => void;
}) {
  const [installId, setInstallId] = useState<string>();

  const { shellOutput } = useTextHTTPStream(
    installId ? `/file-manager/install-switch/${installId}` : undefined
  );

  useMountEffect(() => {
    api<{ installId: string }>("/file-manager/install-switch", "post", {
      paths: [getPath(file)],
    }).then((res) => {
      setInstallId(res.installId);
    });
  });

  return (
    <DialogBase
      sx={(theme) => ({
        width: "90vw",
        height: "90vh",
        maxWidth: "1280px",
        maxHeight: "720px",
        [theme.breakpoints.down("sm")]: {
          width: "100vw",
          height: "100vh",
          maxWidth: "unset",
          maxHeight: "unset",
          borderRadius: 0,
        },
      })}
      contentSx={(theme) => ({
        height: "100%",
        [theme.breakpoints.down("sm")]: { px: 0, pb: 0 },
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      })}
      title="Installing"
      closeButtonOnMobile
      onClose={onClose}
    >
      {shellOutput}
    </DialogBase>
  );
}
