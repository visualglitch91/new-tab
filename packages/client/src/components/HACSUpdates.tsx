import ListCard from "./ListCard";
import { hassUrl, useEntity } from "../utils/hass";
import ListItem from "./ListItem";
import PillButton from "./PillButton";

export default function HACSUpdates() {
  const repositories: {
    display_name: string;
    available_version: string;
    installed_version: string;
  }[] = useEntity("sensor.hacs")?.attributes?.repositories || [];

  return (
    <ListCard
      title="HACS"
      // titleAction={
      //   <PillButton
      //     icon="mdi:open-in-new"
      //     onClick={() => window.open(`${hassUrl}/hacs/integrations`)}
      //   />
      // }
    >
      {repositories.length === 0 ? (
        <ListItem label="Sem atualizações pendentes" />
      ) : (
        repositories.map((it, index) => (
          <ListItem key={index} label={it.display_name}>
            {`${it.installed_version} > ${it.available_version}`}
          </ListItem>
        ))
      )}
    </ListCard>
  );
}
