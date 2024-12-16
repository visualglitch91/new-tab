import { useMutation } from "@tanstack/react-query";
import { useMenu } from "$app/utils/useMenu";
import api from "$app/utils/api";
import useConfirm from "$app/utils/useConfirm";
import { sleep } from "$app/utils/general";
import ListItem from "../ListItem";
import DotLoading from "../DotLoading";
import ColorBadge from "../ColorBadge";
import { ParsedApp, STATUS_COLORS, formatName } from "./utils";

enum Menu {
  LOGS = "logs",
  STOP = "stop",
  START = "start",
  RESTART = "restart",
}

export function AppItem({
  app,
  onAction,
}: {
  app: ParsedApp;
  onAction: () => void;
}) {
  const showMenu = useMenu();
  const confirm = useConfirm();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ action }: { action: Omit<Menu, "LOGS"> }) => {
      return api(
        `/app-manager/${app.type}/${app.rawName}/${action}`,
        "post"
      ).then(() => sleep(9_000));
    },
    onSuccess: () => onAction(),
  });

  const running = app.status === "running";

  function makeAction(action: Menu) {
    return () => {
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
      ],
    });
  }

  return (
    <ListItem
      minSize="sm"
      icon={<ColorBadge size={12} color={STATUS_COLORS[app.status]} />}
      primaryText={formatName(app.name)}
      endSlot={isPending ? <DotLoading /> : running ? app.usage : "Parado"}
      onClick={showActionsMenu}
    />
  );
}
