import { HassEntity } from "home-assistant-js-websocket";

export interface BaseComponentGroupItem {
  label?: React.ReactNode;
  icon?: string;
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  checked?: boolean;
  changeTimeout?: number;
  hiddenOnDesktop?: boolean;
  confirmBefore?: boolean;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onPress?: () => void;
  onHold?: () => void;
}

export type ComponentGroupItem =
  | string
  | "divider"
  | boolean
  | null
  | undefined
  | React.ReactNode
  | {
      element: React.ReactNode;
      hiddenOnDesktop?: boolean;
    }
  | (BaseComponentGroupItem & {
      label: string;
      icon: string;
      renderListContent?: () => React.ReactNode;
    })
  | (BaseComponentGroupItem & {
      entityId: string;
      ignoreOnGroupSwitch?: boolean;
      renderListContent?: (entity: HassEntity) => React.ReactNode;
    });

export interface ComponentGroupProps {
  layout: "list" | "grid";
  title?: string;
  titleAction?: React.ReactNode;
  items: ComponentGroupItem[];
  showGroupSwitch?: boolean;
  extraGroupSwitchEntityIds?: string[];
}

export interface Package {
  name: string;
  code: string;
  lastEvent?: {
    at: string;
    description: string;
    location?: string;
  };
}
