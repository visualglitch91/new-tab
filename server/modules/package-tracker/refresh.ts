import ky from "ky";
import { orderBy } from "lodash";
import * as cheerio from "cheerio";
import { PackageTrackerItem } from "$common/types/package-tracker";
import config from "$server/config";
import { Logger } from "$server/utils";
import storage from "./storage";

const { webhook } = config.package_tracker;

function normalizeEvent(str: string) {
  let tmp = str;

  [
    ["Status: ", ""],
    ["Local: ", ""],
    ["Origem: ", "▼ "],
    ["Destino: ", "⦿ "],
    [" / ", "/"],
    ["Objeto em trânsito - por favor aguarde", "Em trânsito"],
    ["Objeto entregue ao destinatário", "Entregue"],
  ].forEach(([a, b]) => {
    tmp = tmp.replaceAll(a, b);
  });

  return tmp;
}

async function track(code: string) {
  try {
    const res = await ky
      .get(`https://www.linkcorreios.com.br/?id=+${code}`)
      .text();

    const $ = cheerio.load(res);
    const $events = $(".singlepost .linha_status");

    if ($events.length === 0) {
      return { eventCount: 0 };
    }

    const events = orderBy(
      $events
        .map((_, eventNode) => {
          const textContents = $(eventNode)
            .find("li")
            .map((_, li) => $(li).find("br").replaceWith("\n").end().text());

          const [rawDescription, rawAt, ...rest] = textContents;
          const rawLocation = rest.join("\n");

          return {
            at: parseDateString(
              rawAt.replace("Data  : ", "").replace("Hora: ", "")
            ),
            description: normalizeEvent(rawDescription),
            location: normalizeEvent(rawLocation),
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
  const parts = dateString.split(" | ");

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

let refreshPromise: Promise<void> | null;

export default async function refresh(logger: Logger) {
  if (!refreshPromise) {
    refreshPromise = new Promise<void>(async (resolve) => {
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
              ? lastEvent.description.includes("Entregue")
                ? "delivered"
                : lastEvent.description.includes("aguardando pagamento")
                ? "pending-payment"
                : lastEvent.description.includes(
                    "Objeto saiu para entrega ao destinatário"
                  )
                ? "en-route"
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

              ky.post(webhook, { json: updatedPackage }).catch(logger.error);
            }

            return updatedPackage;
          })
        )
      );

      updatedPackages.forEach((it) => storage.save(it));
      resolve();
    })
      .catch((err) => {
        logger.error(err, "Error while refreshing package statuses");
      })
      .then(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}
