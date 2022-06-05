import { toggleSidebar } from "../utils/hass.mjs";
import { h } from "../utils/preact.mjs";
import { useHass } from "../utils/hass.mjs";
import ListCardRow from "./ListCardRow.mjs";
import Button from "./Button.mjs";

export default function SidebarToggleRow() {
  const { user } = useHass();
  const isAdmin = user.is_admin;

  if (!isAdmin) {
    return null;
  }

  return h`
    <${ListCardRow} icon="mdi:cog" label="Barra Lateral">
      <${Button} onClick=${toggleSidebar}>
        Abrir
      </${Button}>
    </${ListCardRow}>
  `;
}
