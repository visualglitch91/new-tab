import { type ButtonProps, DialogContentText, Button } from "@mui/material";
import DialogBase, { DialogBaseControlProps } from "./DialogBase";
import { useBreakpoint } from "../utils/general";
import DialogSlideTransition from "./DialogSlideTransition";
import { sxx } from "../utils/styling";
import { SxProps } from "../theme/utils";

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
  sx?: SxProps;
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
  sx,
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
    buttons.push(
      <Button key="cancel" onClick={onClose}>
        Cancelar
      </Button>
    );
  }

  return (
    <DialogBase
      {...props}
      sx={sxx(
        {
          "& .MuiDialogActions-root": {
            flexDirection: "column",
            gap: 1.5,
            alignItems: "stretch",
            "& > *": {
              marginLeft: "unset !important",
            },
          },
        },
        sx
      )}
      bottomMobileSheet
      title={title}
      footer={buttons}
      TransitionComponent={isMobile ? DialogSlideTransition : undefined}
      onClose={onClose}
    >
      {description && <DialogContentText>{description}</DialogContentText>}
    </DialogBase>
  );
}
