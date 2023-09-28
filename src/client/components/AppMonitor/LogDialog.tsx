import { ParsedApp } from "./utils";
import DialogBase from "../DialogBase";
import useTextHTTPStream from "../../utils/useTextHTTPStream";

export default function LogDialog({
  app,
  onClose,
}: {
  app: ParsedApp;
  onClose: () => void;
}) {
  const { shellOutput } = useTextHTTPStream(
    `/app-manager/${app.type}/${app.rawName}/logs`
  );

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
