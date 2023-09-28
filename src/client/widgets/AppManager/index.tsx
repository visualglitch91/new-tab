import ListCard from "../../components/ListCard";
import { useData, formatStackName } from "./utils";
import { AppItem } from "./AppItem";

export default function AppManager() {
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
