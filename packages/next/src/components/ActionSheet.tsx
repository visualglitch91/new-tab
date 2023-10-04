import {
  type ButtonProps,
  DialogContentText,
  Stack,
  Button,
} from "@mui/material";
import DialogBase, { DialogBaseControlProps } from "./DialogBase";
import { useBreakpoint } from "../utils/general";
import DialogSlideTransition from "./DialogSlideTransition";

export type ActionMap<T extends string> = Record<
  T,
  {
    label: string;
    color?: ButtonProps["color"];
    variant?: ButtonProps["variant"];
  }
>;

interface ActionSheetProps<T extends string> {
  title: string;
  description?: string;
  hideCancelButton?: boolean;
  onSelect: (value: T) => void;
  actions: ActionMap<T>;
}

export default function ActionSheet<T extends string>({
  title,
  description,
  actions,
  hideCancelButton,
  onSelect,
  onClose,
  ...props
}: ActionSheetProps<T> & DialogBaseControlProps) {
  const { isMobile } = useBreakpoint();

  //@ts-expect-error
  const buttons = Object.entries(actions).map(([key, { label, ...props }]) => (
    <Button key={key} {...props} onClick={() => onSelect(key as T)}>
      {label}
    </Button>
  ));

  if (!hideCancelButton) {
    buttons.push(<Button onClick={onClose}>Cancelar</Button>);
  }

  return (
    <DialogBase
      {...props}
      bottomMobileSheet
      title={title}
      footer={isMobile ? <Stack spacing={2}>{buttons}</Stack> : buttons}
      TransitionComponent={isMobile ? DialogSlideTransition : undefined}
      onClose={onClose}
    >
      {description && <DialogContentText>{description}</DialogContentText>}
    </DialogBase>
  );
}
