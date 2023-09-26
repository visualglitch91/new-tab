import { useQuery } from "react-query";
import { App } from "../../../types/app-manager";
import api from "../../utils/api";

export const STACKS = [
  "home-assistant",
  "media-center",
  "matrix",
  "management",
];

const LABELS: Record<string, string | undefined> = {
  other: "Outros",
  management: "Administração",
};

export const STATUS_COLORS = {
  running: "#50fa7b",
  stoppped: "#ff79c6",
  errored: "#ff5555",
} as const;

function formatUsage(app: App) {
  return app.status === "running"
    ? `${app.memory || "0mb"} • ${(app.cpu || 0).toFixed(2)}%`
    : "";
}

export function parseApp(app: App) {
  const { name, status, ...rest } = app;
  const stack = STACKS.find((stack) => name.startsWith(stack));

  return {
    stack: stack || "other",
    name: (stack ? name.substring(stack.length + 1) : "") || name,
    status: status || "stoppped",
    usage: formatUsage(app),
    rawName: name,
    ...rest,
  };
}

export function formatName(stack: string) {
  return stack
    .split("-")
    .map((word) => {
      if (word.length > 0) {
        const firstLetter = word[0].toUpperCase();
        const restOfWord = word.slice(1).toLowerCase();
        return firstLetter + restOfWord;
      }

      return word;
    })
    .join(" ");
}

export function formatStackName(stack: string) {
  return LABELS[stack] || formatName(stack);
}

export type ParsedApp = ReturnType<typeof parseApp>;

export function useData() {
  return useQuery("apps", () =>
    api<{ apps: App[] }>("/app-manager/apps", "get")
      .then(({ apps }) => apps.map(parseApp))
      .then((parsedApps) =>
        Object.entries(
          parsedApps.reduce((acc, it) => {
            return { ...acc, [it.stack]: [...(acc[it.stack] || []), it] };
          }, {} as Record<string, ParsedApp[]>)
        ).sort(([a]) => (a === "other" ? 1 : -1))
      )
  );
}
