import { Stack } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../utils/queryClient";
import { useMenu } from "../../utils/useMenu";
import useModal from "../../utils/useModal";
import api from "../../utils/api";
import ListItem from "../ListItem";
import DotLoading from "../DotLoading";
import ColorBadge from "../ColorBadge";
import Icon from "../Icon";
import { ParsedApp, STATUS_COLORS, formatName } from "./utils";
import LogDialog from "./LogDialog";
import useConfirm from "../../utils/useConfirm";

enum Menu {
  LOGS = "logs",
  STOP = "stop",
  START = "start",
  RESTART = "restart",
}

export function AppItem({ app }: { app: ParsedApp }) {
  const showMenu = useMenu();
  const confirm = useConfirm();
  const mount = useModal();

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
    mount((_, props) => <LogDialog app={app} {...props} />);
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
          confirm({ title: "Continuar?", onConfirm: () => mutate({ action }) });
        } else {
          mutate({ action });
        }
      },
    });
  }

  return (
    <ListItem
      icon={<ColorBadge size={12} color={STATUS_COLORS[app.status]} />}
      primaryText={
        <Stack direction="row" spacing={0.8} alignItems="center">
          <span>{formatName(app.name)}</span>
          {app.updateAvailable && (
            <Icon
              size={18}
              sx={{ mt: "-1px" }}
              icon="arrow-up-circle-outline"
            />
          )}
        </Stack>
      }
      endSlot={isLoading ? <DotLoading /> : running ? app.usage : "Parado"}
      onClick={showActionsMenu}
    />
  );
}
