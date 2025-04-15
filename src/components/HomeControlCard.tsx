import { Switch } from "@mui/material";
import { getConfig, setConfig } from "$app/utils/useConfig";
import version from "$app/version.json";
import ListSection from "./ListSection";
import ListItem from "./ListItem";

export default function HomeControlCard() {
  return (
    <ListSection title="Home Control">
      <ListItem icon="numeric" primaryText="Versão" endSlot={version} />
      <ListItem
        icon="shimmer"
        primaryText="Efeitos de Blur"
        endSlot={
          <Switch
            defaultChecked={!getConfig("disableBlurEffects")}
            onChange={(_, checked) => {
              setConfig("disableBlurEffects", !checked);
              setTimeout(() => {
                window.location.reload();
              }, 500);
            }}
          />
        }
      />
    </ListSection>
  );
}
