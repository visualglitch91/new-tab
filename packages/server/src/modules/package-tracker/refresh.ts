import axios from "axios";
import * as cheerio from "cheerio";
import { PackageTrackerItem } from "@home-control/types/package-tracker";
import { config } from "../../../../../config";
import { Logger } from "../../utils";
import storage from "./storage";
import { orderBy } from "lodash";

const { webhook } = config.package_tracker;

async function track(code: string) {
  try {
    const res = await axios.get(`https://linketrack.com/track?codigo=${code}`);
    const $ = cheerio.load(res.data);
    const $events = $(".boxEvento");

    const events = orderBy(
      $events
        .map((_, eventNode) => {
          const textContents = $(eventNode)
            .find("li")
            .map((_, li) => $(li).find("br").replaceWith("\n").end().text());

          if (textContents[0].includes("Código não localizado")) {
            return null;
          }

          return {
            at: parseDateString(textContents[1].substring(6)),
            description: textContents[2],
            location: textContents[0].substring(7),
          };
        })
        .get(),
      ["at"],
      ["desc"]
    );

    return {
      eventCount: events[0] === null ? 0 : $events.length,
      lastEvent: events[0],
    };
  } catch (_) {
    return { eventCount: 0 };
  }
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
  if (timeParts.length !== 2 && timeParts.length !== 3) {
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

export default async function refresh(logger: Logger) {
  // No need to fetch status of delivered packages
  const undeliveredPackages = storage
    .getAll()
    .filter((it) => it.status !== "delivered");

  const packagesBycode = undeliveredPackages.reduce(
    (acc, it) => ({ ...acc, [it.code]: it }),
    {} as Record<string, PackageTrackerItem>
  );

  const updatedPackages = await Promise.all(
    Object.keys(packagesBycode).map((code) =>
      track(code).then((result) => {
        const prevPackage = packagesBycode[code];
        const { eventCount, lastEvent = prevPackage.lastEvent } = result;

        const status: PackageTrackerItem["status"] = lastEvent
          ? lastEvent.description.includes("Objeto entregue")
            ? "delivered"
            : lastEvent.description.includes("aguardando pagamento")
            ? "pending-payment"
            : "in-transit"
          : "not-found";

        const updatedPackage = {
          ...prevPackage,
          status,
          lastEvent,
          eventCount,
        };

        if (prevPackage.eventCount < eventCount && webhook) {
          logger.info(
            "[package-tracker] calling webhook %s with package %o",
            webhook,
            updatedPackage
          );

          axios.post(webhook, updatedPackage).catch(logger.error);
        }

        return updatedPackage;
      })
    )
  );

  updatedPackages.forEach((it) => storage.save(it));
}
