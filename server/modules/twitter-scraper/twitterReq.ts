import fs from "node:fs";
import path from "node:path";
import ky from "ky";
import { logger, wait } from "$server/utils";

const validCurlCommand = fs.readFileSync(
  path.join(__dirname, "curl_command.txt"),
  "utf8"
);

const validHeaders = extractHeaders(validCurlCommand);

function extractHeaders(curlCommand: string) {
  const headers: Record<string, string> = {};

  // Match header lines in the curl command
  const headerRegex = /-H ['"](.*?)['"]/g;
  let match;

  while ((match = headerRegex.exec(curlCommand)) !== null) {
    const header = match[1];
    const [key, value] = header.split(":").map((part) => part.trim());
    headers[key] = value;
  }

  return headers;
}

export default async function twitterReq<T = any>(
  path: string,
  method: "GET" | "POST",
  data?: any
) {
  const tryReq = async (retry = 0): Promise<T> => {
    const response = await ky(`https://twitter.com/i/api/graphql${path}`, {
      method,
      headers: validHeaders,
      referrer: `https://twitter.com/home`,
      referrerPolicy: "strict-origin-when-cross-origin",
      json: typeof data !== "undefined" ? data : undefined,
      mode: "cors",
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 429) {
        logger.warn("Rate limit reached. Waiting 1 minute");
        await wait(1000 * 60);
        return tryReq(retry + 1);
      }

      throw new Error(
        retry == 5
          ? "Max retries reached"
          : await response.text().catch(() => "Could not get response")
      );
    }

    return await response.json();
  };

  return tryReq();
}
