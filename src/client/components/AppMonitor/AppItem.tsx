import { styled } from "@mui/joy";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../utils/queryClient";
import { useConfirm } from "../../utils/useConfirm";
import { useMenu } from "../../utils/useMenu";
import useModal from "../../utils/useModal";
import api from "../../utils/api";
import ListItem from "../ListItem";
import DotLoading from "../DotLoading";
import ColorBadge from "../ColorBadge";
import Icon from "../Icon";
import { ParsedApp, STATUS_COLORS, formatName } from "./utils";
import LogDialog from "./LogDialog";

enum Menu {
  LOGS = "logs",
  STOP = "stop",
  START = "start",
  RESTART = "restart",
}

const Label = styled("div")({
  gap: 6,
  display: "flex",
  alignItems: "center",
});

export function AppItem({ app }: { app: ParsedApp }) {
  const [showMenu, menu] = useMenu();
  const [confirm, modals1] = useConfirm();
  const [mount, modals2] = useModal();

  const { mutate, isLoading } = useMutation(
    ({ action }: { action: Omit<Menu, "LOGS"> }) => {
      return api(
        `/app-manager/${app.type}/${app.rawName}/${action}`,
        "post"
      ).then(() => queryClient.refetchQueries(["apps"]));
    }
  );

  const running = app.status === "running";

  function showLogs() {
    mount((unmount) => <LogDialog app={app} onClose={unmount} />);
  }

  function showActionsMenu() {
    showMenu({
      title: "Opções",
      options: [
        ...(running
          ? [
              { value: Menu.STOP, label: "Parar" },
              { value: Menu.RESTART, label: "Reiniciar" },
            ]
          : [{ value: Menu.START, label: "Iniciar" }]),
        { value: Menu.LOGS, label: "Logs" },
      ],
      onSelect: (action) => {
        if (action === Menu.LOGS) {
          showLogs();
          return;
        }

        if (running) {
          confirm({
            title: "Continuar?",
            onConfirm: () => mutate({ action }),
          });
        } else {
          mutate({ action });
        }
      },
    });
  }

  return (
    <ListItem
      sx={{ "& > *": { height: 32 } }}
      icon={<ColorBadge size={12} color={STATUS_COLORS[app.status]} />}
      label={
        <Label>
          {formatName(app.name)}
          {app.updateAvailable && (
            <Icon icon="arrow-up-circle-outline" size={18} />
          )}
        </Label>
      }
      onSecondaryAction={showActionsMenu}
    >
      {menu}
      {modals1}
      {modals2}
      {isLoading ? <DotLoading /> : running ? app.usage : "Parado"}
    </ListItem>
  );
}
