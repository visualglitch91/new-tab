import { orderBy } from "lodash";
import { useData, formatStackName } from "./utils";
import ListSection from "../ListSection";
import { AppItem } from "./AppItem";

export default function AppManager() {
  const { data, refetch } = useData();

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <>
      {data.map(([stack, apps]) => (
        <ListSection key={stack} title={formatStackName(stack)}>
          {orderBy(apps, ["name"], ["asc"]).map((app) => (
            <AppItem key={`app-${app.id}`} app={app} onAction={refetch} />
          ))}
        </ListSection>
      ))}
    </>
  );
}
