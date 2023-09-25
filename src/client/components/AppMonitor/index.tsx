import { Fragment } from "react";
import { useEntity } from "../../utils/hass";
import ListCard from "../ListCard";
import { ListDivider } from "../ComponentGroup";
import { App } from "./types";
import { AppItem } from "./AppItem";
import BaseDiv from "../BaseDiv";

const stacks = ["home-assistant", "media-center", "matrix", "management"];

const labels: Record<string, string | undefined> = {
  other: "Outros",
  management: "Administração",
};

function StackTitle({ title }: { title: string }) {
  return (
    <BaseDiv
      sx={{
        color: "white",
        background: "transparent",
        textTransform: "capitalize",
        "&:not(:first-of-type)": { marginTop: "16px" },
      }}
    >
      {labels[title] || title.split("-").join(" ")}
    </BaseDiv>
  );
}

export default function AppMonitor({ entityId }: { entityId: string }) {
  const state = useEntity(entityId);
  const apps: App[] = state?.attributes?.apps || [];

  if (apps.length === 0) {
    return null;
  }

  const grouped = Object.entries(
    apps.reduce((acc, it) => {
      const stack =
        stacks.find((stack) => it.name.startsWith(stack)) || "other";
      return { ...acc, [stack]: [...(acc[stack] || []), it] };
    }, {} as Record<string, App[]>)
  ).sort(([a]) => (a === "other" ? 1 : -1));

  return (
    <ListCard title="Apps">
      {grouped.map(([stack, apps]) => (
        <Fragment key={stack}>
          <StackTitle title={stack} />
          <ListDivider />
          {apps.map((app) => (
            <AppItem
              key={`app-${app.id}`}
              app={app}
              stack={stack !== "other" ? stack : undefined}
            />
          ))}
        </Fragment>
      ))}
    </ListCard>
  );
}
