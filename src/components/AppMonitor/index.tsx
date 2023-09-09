import { useEntity } from "../../utils/hass";
import { App } from "./types";
import ListCard from "../ListCard";
import { AppItem } from "./AppItem";
import { ListDivider } from "../ComponentGroup";
import { css } from "../../styling";

const stacks = ["home-assistant", "media-center", "matrix"];

const stackTitleClassName = css`
  text-transform: capitalize;

  &:not(:first-child) {
    margin-top: 16px;
  }
`;

function StackTitle({ title }: { title: string }) {
  return (
    <div className={stackTitleClassName}>
      {title === "other" ? "Outros" : title.split("-").join(" ")}
    </div>
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
  ).sort(([a], [b]) => (a === "other" ? 1 : -1));

  return (
    <ListCard title="Apps">
      {grouped.map(([stack, apps]) => (
        <>
          <StackTitle title={stack} />
          <ListDivider />
          {apps.map((app) => (
            <AppItem
              key={`app-${app.id}`}
              app={app}
              stack={stack !== "other" ? stack : undefined}
            />
          ))}
        </>
      ))}
    </ListCard>
  );
}
