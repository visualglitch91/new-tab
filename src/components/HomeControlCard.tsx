import { Switch } from "@mui/material";
import { clearAllCachesAndReload } from "$app/utils/updater";
import { getConfig, setConfig } from "$app/utils/useConfig";
import version from "$app/version.json";
import AltIconButton from "./AltIconButton";
import ListSection from "./ListSection";
import ListItem from "./ListItem";

export default function HomeControlCard() {
  return (
    <ListSection
      title={
        <>
          <span>Home Control</span>
          <AltIconButton icon="refresh" onClick={clearAllCachesAndReload} />
        </>
      }
    >
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
