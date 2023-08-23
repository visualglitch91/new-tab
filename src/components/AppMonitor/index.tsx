import { useEntity } from "../../utils/hass";
import { App } from "./types";
import ListCard from "../ListCard";
import { AppItem } from "./AppItem";

export default function AppMonitor({ entityId }: { entityId: string }) {
  const state = useEntity(entityId);
  const apps: App[] = state?.attributes?.apps || [];

  if (apps.length === 0) {
    return null;
  }

  return (
    <ListCard title="Apps">
      {apps.map((app) => (
        <AppItem key={`app-${app.id}`} app={app} />
      ))}
    </ListCard>
  );
}
