import { h, css, useHass } from "../utils.mjs";

css(`
  .component__sidebar-toggle {}
`);

export default function SidebarToggle() {
  const { user, toggleSidebar } = useHass();
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
