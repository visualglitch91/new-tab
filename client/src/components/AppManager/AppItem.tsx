import { Stack } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "$client/utils/queryClient";
import { useMenu } from "$client/utils/useMenu";
import useModal from "$client/utils/useModal";
import api from "$client/utils/api";
import useConfirm from "$client/utils/useConfirm";
import ListItem from "../ListItem";
import DotLoading from "../DotLoading";
import ColorBadge from "../ColorBadge";
import Icon from "../Icon";
import LogDialog from "./LogDialog";
import { ParsedApp, STATUS_COLORS, formatName } from "./utils";

enum Menu {
  LOGS = "logs",
  STOP = "stop",
  START = "start",
  RESTART = "restart",
}

const appStatusIcons = {
  none: null,
  local: null,
  updated: null,
  locked: "lock-outline",
  unknown: "alert-outline",
  "update-available": "arrow-up-circle-outline",
};

export function AppItem({ app }: { app: ParsedApp }) {
  const showMenu = useMenu();
  const confirm = useConfirm();
  const mount = useModal();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ action }: { action: Omit<Menu, "LOGS"> }) => {
      return api(`/app-manager/${app.type}/${app.rawName}/${action}`, "post");
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["apps"] });
    },
  });

  const running = app.status === "running";

  function showLogs() {
    mount((_, props) => <LogDialog app={app} {...props} />);
  }

  function makeAction(action: Menu) {
    return () => {
      if (action === Menu.LOGS) {
        showLogs();
        return;
      }

      if (running) {
        confirm({ title: "Continuar?", onConfirm: () => mutate({ action }) });
      } else {
        mutate({ action });
      }
    };
  }

  function showActionsMenu(e: React.MouseEvent<HTMLElement>) {
    showMenu({
      mouseEvent: e.nativeEvent,
      clickAnchor: true,
      title: "Opções",
      options: [
        {
          label: "Parar",
          onClick: makeAction(Menu.STOP),
          hidden: !running,
        },
        {
          label: "Reiniciar",
          onClick: makeAction(Menu.RESTART),
          hidden: !running,
        },
        {
          label: "Iniciar",
          onClick: makeAction(Menu.START),
          hidden: running,
        },
        {
          label: "Logs",
          onClick: makeAction(Menu.LOGS),
        },
      ],
    });
  }

  return (
    <ListItem
      minSize="sm"
      icon={<ColorBadge size={12} color={STATUS_COLORS[app.status]} />}
      primaryText={
        <Stack direction="row" spacing={0.8} alignItems="center">
          <span>{formatName(app.name)}</span>
          {(() => {
            const icon = appStatusIcons[app.updateStatus || "none"];

            return icon ? (
              <Icon size={18} sx={{ mt: "-1px" }} icon={icon} />
            ) : null;
          })()}
        </Stack>
      }
      endSlot={isPending ? <DotLoading /> : running ? app.usage : "Parado"}
      onClick={showActionsMenu}
    />
  );
}
