import { createProccessOutputStreamer } from "../../utils";

export default function installSwitchGame(root: string, paths: string[]) {
  return createProccessOutputStreamer("/usr/bin/java", [
    "-jar",
    `${__dirname}/ns-usbloader-7.0.jar`,
    "-n",
    "nsip=10.0.0.16",
    ...paths.map((it) => `"${root}/${it}"`),
  ]);
}
