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
    hidden?: boolean;
    action: () => void;
  }
>;

interface ActionSheetProps<T extends string> {
  title?: string;
  sx?: SxProps;
  description?: string;
  hideCancelButton?: boolean;
  keepOpen?: boolean;
  actions: ActionMap<T>;
}

const verticalButtonsSx: SxProps = {
  "& .MuiDialogActions-root": {
    flexDirection: "column",
    alignItems: "stretch",
  },
};

export default function ActionSheet<T extends string>({
  title,
  description,
  actions,
  hideCancelButton,
  keepOpen,
  sx,
  onClose,
  ...props
}: ActionSheetProps<T> & DialogBaseControlProps) {
  const { isMobile } = useBreakpoint();

  const buttons = Object.entries(actions)
    .map(
      //@ts-expect-error
      ([key, { label, action, hidden, ...props }]) =>
        hidden ? null : (
          <Button
            key={key}
            {...props}
            onClick={() => {
              action();

              if (!keepOpen) {
                onClose();
              }
            }}
          >
            {label}
          </Button>
        )
    )
    .filter(Boolean);

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
            gap: 1.5,
            "& > *": { marginLeft: "unset !important" },
          },
        },
        !title && {
          "& .MuiDialogActions-root": {
            paddingTop: "24px",
          },
        },
        buttons.length === 2
          ? (theme) => ({
              [theme.breakpoints.down("sm")]: verticalButtonsSx,
              [theme.breakpoints.up("sm")]: {
                "& .MuiDialogActions-root": {
                  flexDirection: "row-reverse",
                  justifyContent: "stretch",
                  "& > *": { flex: 1 },
                },
              },
            })
          : verticalButtonsSx,
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
