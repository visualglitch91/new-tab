import { useQuery } from "@tanstack/react-query";
import { App } from "@home-control/types/app-manager";
import api from "../../utils/api";

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
  const { name: rawName, status, ...rest } = app;
  let [stack, name] = rawName.split("--");

  if (!name) {
    name = stack;
    stack = "other";
  }

  return {
    stack,
    name,
    rawName,
    status: status || "stoppped",
    usage: formatUsage(app),
    ...rest,
  };
}

export function formatName(appName: string) {
  return appName;
}

export function formatStackName(stack: string) {
  return LABELS[stack] || formatName(stack);
}

export type ParsedApp = ReturnType<typeof parseApp>;

export function useData() {
  return useQuery(["apps"], () =>
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
