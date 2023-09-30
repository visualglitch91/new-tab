//@ts-expect-error
import { Crypto as crypto } from "ezcrypto";
//@ts-expect-error
import aesjs from "aes-js";
import axios from "axios";
//@ts-expect-error
import textEncoding from "text-encoding";
const pkcs7 = require("pkcs7");

const __ENPOINT = "https://api.jdownloader.org";
const __apiVer = 1;
let __rid_counter = 0;

const __secrets = {
  loginSecret: null as Uint8Array | null,
  deviceSecret: null as Uint8Array | null,
  sessionToken: null as string | null,
  regainToken: null as string | null,
  serverEncryptionToken: null as Uint8Array | null,
  deviceEncryptionToken: null as Uint8Array | null,
};

type Secrets = typeof __secrets;

export function getSecret<K extends keyof Secrets>(
  key: K
): NonNullable<Secrets[K]> {
  if (__secrets[key] === null) {
    throw new Error(`"${key}" is null`);
  }

  return __secrets[key]!;
}

export function setSecret<K extends keyof Secrets>(
  key: K,
  value: NonNullable<Secrets[K]>
) {
  __secrets[key] = value;
}

export function clearSecret<K extends keyof Secrets>(key: K) {
  __secrets[key] = null;
}

function uniqueRid() {
  __rid_counter = Math.floor(Date.now());
  return __rid_counter;
}

export function createSecret(
  username: string,
  password: string,
  domain: string
) {
  return crypto.SHA256(username + password + domain, { asBytes: true });
}

function sign(key: any, data: any) {
  return crypto.HMAC(crypto.SHA256, data, key, { asBytes: false });
}

function encrypt(data: any, iv_key: any) {
  const string_iv_key = crypto.charenc.Binary.bytesToString(iv_key);
  const string_iv = string_iv_key.substring(0, string_iv_key.length / 2);
  const string_key = string_iv_key.substring(
    string_iv_key.length / 2,
    string_iv_key.length
  );
  const iv = crypto.charenc.Binary.stringToBytes(string_iv);
  const key = crypto.charenc.Binary.stringToBytes(string_key);
  const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
  const dataBytes = aesjs.utils.utf8.toBytes(data);
  const paddedData = aesjs.padding.pkcs7.pad(dataBytes);
  const encryptedBytes = aesCbc.encrypt(paddedData);
  //@ts-ignore
  const buff = Buffer.from(encryptedBytes, "base64");
  const base64data = buff.toString("base64");
  return base64data;
}

function decrypt(data: any, iv_key: any) {
  const string_iv_key = crypto.charenc.Binary.bytesToString(iv_key);
  const string_iv = string_iv_key.substring(0, string_iv_key.length / 2);
  const string_key = string_iv_key.substring(
    string_iv_key.length / 2,
    string_iv_key.length
  );
  const iv = crypto.charenc.Binary.stringToBytes(string_iv);
  const key = crypto.charenc.Binary.stringToBytes(string_key);
  const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
  const test = aesCbc.decrypt(Buffer.from(data, "base64"));
  const textDecoder = new textEncoding.TextDecoder("utf-8");
  return textDecoder.decode(pkcs7.unpad(test));
}

function unescapeJson(json: string) {
  return json
    .replace(
      /[^\x30-\x39\x41-\x5A\x61-\x7A\x7B\x7D\x20\x26\x28\x29\x2C\x27\x22\x2E\x2F\x26\x40\x5C\x3A\x2D\x5C\x5B\x5D]/g,
      ""
    )
    .replace(/\s+/g, " ");
}

export function postQuery(url: string, params?: any) {
  return axios
    .post(
      url,
      params,
      params
        ? {
            headers: {
              "Content-Type": "application/aesjson-jd; charset=utf-8",
            },
          }
        : undefined
    )
    .then(
      (res) => res.data,
      (err) => Promise.reject(err.response.status)
    );
}

export function callServer(query: string, key: any, params?: any) {
  let rid = uniqueRid();

  if (params) {
    if (key) {
      params = encrypt(params, key);
    }

    rid = __rid_counter;
  }

  if (query.includes("?")) {
    query += "&";
  } else {
    query += "?";
  }

  query = `${query}rid=${rid}`;
  const signature = sign(key, query);

  query += `&signature=${signature}`;
  const url = __ENPOINT + query;

  return postQuery(url, params).then((parsedBody) => {
    const result = decrypt(parsedBody, key);
    return JSON.parse(unescapeJson(result));
  });
}

export function callAction(action: string, deviceId: string, params?: any) {
  const sessionToken = getSecret("sessionToken");
  const deviceEncryptionToken = getSecret("deviceEncryptionToken");

  const query = `/t_${encodeURI(sessionToken)}_${encodeURI(deviceId)}${action}`;

  let json;
  if (params) {
    json = {
      url: action,
      params,
      rid: uniqueRid(),
      apiVer: __apiVer,
    };
  } else {
    json = {
      url: action,
      rid: uniqueRid(),
      apiVer: __apiVer,
    };
  }

  const jsonData = encrypt(JSON.stringify(json), deviceEncryptionToken);
  const url = __ENPOINT + query;

  return postQuery(url, jsonData).then((parsedBody) => {
    const result = decrypt(parsedBody, deviceEncryptionToken);
    return JSON.parse(unescapeJson(result));
  });
  // .catch((err) => {
  //   return decrypt(err.error, deviceEncryptionToken).then(rejected);
  // });
}

export function updateEncryptionToken(oldTokenBytes: any, updateToken: any) {
  const updateTokenBytes = crypto.util.hexToBytes(updateToken);
  const buffer = Buffer.from(oldTokenBytes);
  const secondbuffer = Buffer.from(updateTokenBytes);

  const thirdbuffer = Buffer.concat(
    [buffer, secondbuffer],
    buffer.length + secondbuffer.length
  );

  return crypto.SHA256(thirdbuffer, { asBytes: true });
}
