//@ts-expect-error
import filemanager from "@opuscapita/filemanager-server";
import { config } from "../../../../../config";
import { createAppModule, logger } from "../../utils";
import installSwitchGame from "./utils";

const root = config.file_manager.root_dir;

export default createAppModule("file-manager", (instance) => {
  instance.router.use(
    "/navigation",
    filemanager.middleware({
      logger,
      fsRoot: root,
      rootName: root.split("/").slice(-1)[0],
    })
  );

  instance.post<{ Body: { paths: string[] } }>("/install-switch", (req, res) =>
    installSwitchGame(root, req.body.paths)(req, res)
  );
});
