//@ts-expect-error
import filemanager from "@opuscapita/filemanager-server";
import objectid from "bson-objectid";
import { config } from "../../../../config";
import { createAppModule, logger } from "../../utils";
import installSwitchGame from "./utils";

const root = config.file_manager.root_dir;
const switchInstallations: Record<string, string[]> = {};

export default createAppModule("file-manager", (instance) => {
  instance.router.use(
    "/navigation",
    filemanager.middleware({
      logger,
      fsRoot: root,
      rootName: root.split("/").slice(-1)[0],
    })
  );

  instance.get<{ Params: { id: string } }>(
    "/install-switch/:id",
    (req, res) => {
      const paths = switchInstallations[req.params.id];
      delete switchInstallations[req.params.id];
      installSwitchGame(root, paths)(req, res);
      return;
    }
  );

  /*
   * It appears that only get requests
   * can stream, so we need to get creative
   */
  instance.post<{ Body: { paths: string[] } }>(
    "/install-switch",
    async (req) => {
      const installId = String(objectid());
      switchInstallations[installId] = req.body.paths;
      return { installId };
    }
  );
});
