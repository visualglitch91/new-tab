import {
  callAction,
  callServer,
  clearSecret,
  createSecret,
  getSecret,
  setSecret,
  updateEncryptionToken,
} from "./utils";

const __APPKEY = "my_jd_nodeJS_webinterface";
const __SERVER_DOMAIN = "server";
const __DEVICE_DOMAIN = "device";

export function connect(username: string, password: string) {
  const loginSecret = createSecret(username, password, __SERVER_DOMAIN);
  const deviceSecret = createSecret(username, password, __DEVICE_DOMAIN);

  setSecret("loginSecret", loginSecret);
  setSecret("deviceSecret", deviceSecret);

  const query = `/my/connect?email=${encodeURI(username)}&appkey=${__APPKEY}`;

  return callServer(query, loginSecret, null).then((val) => {
    const sessionToken = val.sessiontoken;
    const regainToken = val.regaintoken;

    const serverEncryptionToken = updateEncryptionToken(
      loginSecret,
      sessionToken
    );

    const deviceEncryptionToken = updateEncryptionToken(
      deviceSecret,
      sessionToken
    );

    setSecret("sessionToken", sessionToken);
    setSecret("regainToken", regainToken);
    setSecret("serverEncryptionToken", serverEncryptionToken);
    setSecret("deviceEncryptionToken", deviceEncryptionToken);

    return true;
  });
}

export async function disconnect() {
  try {
    const sessionToken = getSecret("sessionToken");
    const serverEncryptionToken = getSecret("serverEncryptionToken");
    const query = `/my/disconnect?sessiontoken=${encodeURI(sessionToken)}`;

    await callServer(query, serverEncryptionToken).catch(() => {});

    clearSecret("sessionToken");
    clearSecret("regainToken");
    clearSecret("serverEncryptionToken");
    clearSecret("deviceEncryptionToken");
  } catch (_) {}
}

export function listDevices(): Promise<any> {
  const sessionToken = getSecret("sessionToken");
  const serverEncryptionToken = getSecret("serverEncryptionToken");
  const query = `/my/listdevices?sessiontoken=${encodeURI(sessionToken)}`;
  return callServer(query, serverEncryptionToken).then((val) => val.list);
}

export function queryLinks(
  deviceId: string,
  packagesIds?: string[] | number | string
): Promise<any> {
  const params: any = {
    addedDate: true,
    bytesLoaded: true,
    bytesTotal: true,
    comment: true,
    enabled: true,
    eta: true,
    extractionStatus: true,
    finished: true,
    finishedDate: true,
    host: true,
    password: true,
    priority: true,
    running: true,
    skipped: true,
    speed: true,
    status: true,
    url: true,
  };

  if (packagesIds) {
    if (typeof packagesIds === "string") {
      params.packageUUIDs = [packagesIds];
    } else if (typeof packagesIds === "number") {
      params.packageUUIDs = [packagesIds];
    } else if (typeof packagesIds === "object" && packagesIds.length > 0) {
      params.packageUUIDs = packagesIds;
    }
  }

  return callAction("/downloadsV2/queryLinks", deviceId, [
    JSON.stringify(params),
  ]);
}

export function addLinks(
  links: string[],
  deviceId: string,
  autostart = true,
  packageName?: string,
  destinationFolder?: string
): Promise<any> {
  const params: any = {
    priority: "DEFAULT",
    links: links,
    autostart: autostart,
  };

  if (packageName) {
    params.packageName = packageName;
    params.overwritePackagizerRules = true;
  }

  if (destinationFolder) {
    params.destinationFolder = destinationFolder;
    params.overwritePackagizerRules = true;
  }

  return callAction("/linkgrabberv2/addLinks", deviceId, [
    JSON.stringify(params),
  ]);
}

export function cleanUpLink(deviceId: string, linkId: string) {
  const params = [
    `[${linkId}]`,
    "[]",
    "DELETE_FINISHED",
    "REMOVE_LINKS_ONLY",
    "SELECTED",
  ];

  return callAction("/downloadsV2/cleanup", deviceId, params);
}
