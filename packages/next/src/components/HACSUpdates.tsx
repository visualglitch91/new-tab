import { hassUrl, useEntity } from "../utils/hass";
import AltIconButton from "./AltIconButton";
import ListSection from "./ListSection";
import ListItem from "./ListItem";
import Icon from "./Icon";

export default function HACSUpdates() {
  const repos: {
    display_name: string;
    available_version: string;
    installed_version: string;
  }[] = useEntity("sensor.hacs")?.attributes?.repositories || [];

  return (
    <ListSection
      title={
        <>
          <span>HACS</span>
          <AltIconButton
            onClick={() => window.open(`${hassUrl}/hacs/integrations`)}
          >
            <Icon icon="mdi:open-in-new" />
          </AltIconButton>
        </>
      }
    >
      {repos.length === 0 ? (
        <ListItem primaryText="Sem atualizações pendentes" />
      ) : (
        repos.map((it, index) => (
          <ListItem
            key={index}
            primaryText={it.display_name}
            endSlot={`${it.installed_version} > ${it.available_version}`}
          />
        ))
      )}
    </ListSection>
  );
}
