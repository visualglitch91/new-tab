import axios from "axios";
import * as cheerio from "cheerio";
import storage from "./storage";
import { PackageTrackerItem } from "../../../types/package-tracker";

async function track(code: string) {
  try {
    const res = await axios.get(`https://linketrack.com/track?codigo=${code}`);
    const $ = cheerio.load(res.data);
    const lastEventNode = $($(".boxEvento")[0]);

    const textContents = lastEventNode
      .find("li")
      .map((_, li) => $(li).find("br").replaceWith("\n").end().text());

    if (textContents[0].includes("Código não localizado")) {
      return undefined;
    }

    return {
      at: parseDateString(textContents[1].substring(6)),
      description: textContents[2],
      location: textContents[0].substring(7),
    };
  } catch (_) {}
}

function parseDateString(dateString: string): string | null {
  const parts = dateString.split(" às ");
  if (parts.length !== 2) {
    // Invalid format
    return null;
  }

  const dateParts = parts[0].split("/");
  if (dateParts.length !== 3) {
    // Invalid date format
    return null;
  }

  const timeParts = parts[1].split(":");
  if (timeParts.length !== 2) {
    // Invalid time format
    return null;
  }

  const day = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1; // Month is zero-based
  const year = parseInt(dateParts[2], 10);
  const hour = parseInt(timeParts[0], 10);
  const minute = parseInt(timeParts[1], 10);

  const dateObject = new Date(year, month, day, hour, minute);

  if (!isNaN(dateObject.getTime())) {
    return dateObject.toISOString();
  } else {
    // Invalid date
    return null;
  }
}

export default function refresh() {
  return storage
    .read()
    .then((packages) => {
      const packagesBycode = packages.reduce(
        (acc, it) => ({ ...acc, [it.code]: it }),
        {} as Record<string, PackageTrackerItem>
      );

      return Promise.all(
        Object.keys(packagesBycode).map((code) =>
          track(code).then((lastEvent) => ({
            ...packagesBycode[code],
            lastEvent,
          }))
        )
      );
    })
    .then(storage.write);
}
