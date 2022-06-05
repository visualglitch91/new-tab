import { toggleSidebar } from "../utils/hass.mjs";
import { h } from "../utils/preact.mjs";
import { css } from "../utils/general.mjs";
import { useHass } from "../utils/hass.mjs";

css(`
  .component__sidebar-toggle {}
`);

export default function SidebarToggle() {
  const { user } = useHass();
  const isAdmin = user.is_admin;

  if (!isAdmin) {
    return null;
  }

  return h`
    <button type="button" class="component__sidebar-toggle" onClick=${toggleSidebar}>
      Toggle Sidebar
    </button>
  `;
}
