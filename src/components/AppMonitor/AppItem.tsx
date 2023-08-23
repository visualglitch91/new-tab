import { css, styled } from "../../styling";
import { useConfirm } from "../../utils/useConfirm";
import { callService } from "../../utils/hass";
import DelayedSwitch from "../DelayedSwitch";
import ListItem from "../ListItem";
import { App } from "./types";

const Stats = styled(
  "span",
  css`
    font-size: 12px;
    opacity: 0.7;
  `
);

export function AppItem({ app }: { app: App }) {
  const [confirm, modals] = useConfirm();
  const running = app.status === "running";

  function toggle() {
    confirm({
      title: "Continuar?",
      onConfirm: () => {
        callService("script", "app_control_action", {
          action: running ? "stop" : "start",
          type: app.type,
          name: app.name,
        });
      },
    });
  }

  return (
    <ListItem
      icon={running ? "mdi-check-circle-outline" : "mdi-close-circle-outline"}
      label={
        running ? (
          <>
            {app.name}{" "}
            <Stats>
              ({app.memory} | {app.cpu.toFixed(2)}%)
            </Stats>
          </>
        ) : (
          app.name
        )
      }
    >
      {modals}
      <DelayedSwitch delay={20_000} checked={running} onInput={toggle} />
    </ListItem>
  );
}
