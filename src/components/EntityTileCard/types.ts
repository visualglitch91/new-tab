import { HassEntity } from "home-assistant-js-websocket";
import useConfirm from "$app/utils/useConfirm";
import useModal from "$app/utils/useModal";
import { useMenu } from "$app/utils/useMenu";

export interface GetPropsArgs {
  label: string;
  entity: HassEntity;
  mount: ReturnType<typeof useModal>;
  confirm: ReturnType<typeof useConfirm>;
  showMenu: ReturnType<typeof useMenu>;
  confirmBefore?: "on" | "off" | "toggle";
}
