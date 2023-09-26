import { styled } from "@mui/joy";
import ListCard from "../ListCard";
import { useData, formatStackName } from "./utils";
import { AppItem } from "./AppItem";

export default function AppMonitor() {
  const { data } = useData();

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <>
      {data.map(([stack, apps]) => (
        <ListCard title={formatStackName(stack)} key={stack}>
          {apps
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((app) => (
              <AppItem key={`app-${app.id}`} app={app} />
            ))}
        </ListCard>
      ))}
    </>
  );
}
