import { useConfirm } from "../../utils/useConfirm";
import { callService } from "../../utils/hass";
import ListItem from "../ListItem";
import { App, formatName } from "./utils";
import { useMenu } from "../../utils/useMenu";
import useAsyncChange from "../../utils/useAsyncChange";
import DotLoading from "../DotLoading";
import ColorBadge from "../ColorBadge";

const STATUS_COLORS = {
  running: "#50fa7b",
  stoppped: "#ff79c6",
  errored: "#ff5555",
} as const;

export function AppItem({ app, stack }: { app: App; stack?: string }) {
  const [showMenu, menu] = useMenu();
  const [confirm, modals] = useConfirm();
  const running = app.status === "running";
  let name = app.name;

  const { changing, change } = useAsyncChange({
    flag: running,
    timeout: 30_000,
  });

  if (stack && name !== stack) {
    name = name.substring(stack.length + 1);
  }

  function runAction(action: "stop" | "start" | "restart") {
    if (change()) {
      callService("script", "app_monitor_action", {
        action,
        type: app.type,
        name: app.name,
      });
    }
  }

  function showActionsMenu() {
    showMenu({
      title: "Opções",
      options: running
        ? [
            { value: "stop", label: "Parar" },
            { value: "restart", label: "Reiniciar" },
          ]
        : [{ value: "start", label: "Iniciar" }],
      onSelect: running
        ? (value) => {
            confirm({
              title: "Continuar?",
              onConfirm: () => runAction(value),
            });
          }
        : runAction,
    });
  }

  return (
    <ListItem
      icon={<ColorBadge size={12} color={STATUS_COLORS[app.status]} />}
      label={formatName(name)}
      onSecondaryAction={showActionsMenu}
    >
      {menu}
      {modals}
      {changing ? (
        <DotLoading />
      ) : running ? (
        `${app.memory} • ${app.cpu.toFixed(2)}%`
      ) : (
        "Parado"
      )}
    </ListItem>
  );
}
