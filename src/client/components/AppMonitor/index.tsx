import { Fragment } from "react";
import { styled } from "@mui/joy";
import { useEntity } from "../../utils/hass";
import ListCard from "../ListCard";
import { ListDivider } from "../ComponentGroup";
import { App, formatStackName } from "./utils";
import { AppItem } from "./AppItem";
import { useResponsive } from "../../utils/general";

const stacks = ["home-assistant", "media-center", "matrix", "management"];

const MobileStackTitle = styled("div")({
  color: "white",
  background: "transparent",
  textTransform: "capitalize",
  "&:not(:first-of-type)": { marginTop: "16px" },
});

export default function AppMonitor({ entityId }: { entityId: string }) {
  const state = useEntity(entityId);
  const apps: App[] = state?.attributes?.apps || [];
  const { isMobile } = useResponsive();

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

  if (isMobile) {
    return (
      <ListCard title="Apps">
        {grouped.map(([stack, apps]) => (
          <Fragment key={stack}>
            <MobileStackTitle>{formatStackName(stack)}</MobileStackTitle>
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

  return (
    <>
      {grouped.map(([stack, apps]) => (
        <ListCard title={formatStackName(stack)} key={stack}>
          {apps.map((app) => (
            <AppItem
              key={`app-${app.id}`}
              app={app}
              stack={stack !== "other" ? stack : undefined}
            />
          ))}
        </ListCard>
      ))}
    </>
  );
}
