import { styled } from "@mui/joy";
import { useMutation } from "@tanstack/react-query";
import { useConfirm } from "material-ui-confirm";
import { queryClient } from "../../utils/queryClient";
import { useMenu } from "../../utils/useMenu";
import useModal from "../../utils/useModal";
import api from "../../utils/api";
import ListItem from "../../components/ListItem";
import DotLoading from "../../components/DotLoading";
import ColorBadge from "../../components/ColorBadge";
import Icon from "../../components/Icon";
import { ParsedApp, STATUS_COLORS, formatName } from "./utils";
import LogDialog from "./LogDialog";

enum Menu {
  LOGS = "logs",
  STOP = "stop",
  START = "start",
  RESTART = "restart",
}

export function AppItem({ app }: { app: ParsedApp }) {
  const [showMenu, menu] = useMenu();
  const confirm = useConfirm();
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
          confirm({ title: "Continuar?" }).then(() => mutate({ action }));
        } else {
          mutate({ action });
        }
      },
    });
  }

  return (
    <>
      {menu}
      {modals2}
      <ListItem
        sx={{ "& > *": { height: 32 } }}
        icon={<ColorBadge size={12} color={STATUS_COLORS[app.status]} />}
        primaryText={
          <>
            {formatName(app.name)}
            {app.updateAvailable && (
              <Icon icon="arrow-up-circle-outline" size={18} />
            )}
          </>
        }
        endSlot={isLoading ? <DotLoading /> : running ? app.usage : "Parado"}
        onClick={showActionsMenu}
      />
    </>
  );
}
