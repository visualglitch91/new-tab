import { type ButtonProps, DialogContentText, Button } from "@mui/material";
import { useBreakpoint } from "$client/utils/general";
import { sxx } from "$client/utils/styling";
import { SxProps } from "$client/theme/utils";
import DialogBase, { DialogBaseControlProps } from "./DialogBase";
import DialogSlideTransition from "./DialogSlideTransition";

export interface ActionSheetProps {
  title?: string;
  sx?: SxProps;
  description?: string;
  hideCancelButton?: boolean;
  keepOpen?: boolean;
  actions: {
    label: string;
    color?: ButtonProps["color"];
    variant?: ButtonProps["variant"];
    hidden?: boolean;
    onClick: () => void;
  }[];
}

const verticalButtonsSx: SxProps = {
  "& .MuiDialogActions-root": {
    flexDirection: "column",
    alignItems: "stretch",
  },
};

export default function ActionSheet({
  title,
  description,
  actions,
  hideCancelButton,
  keepOpen,
  sx,
  onClose,
  ...props
}: ActionSheetProps & DialogBaseControlProps) {
  const { isMobile } = useBreakpoint();

  const buttons = actions
    .map(({ label, onClick, hidden, ...props }, index) =>
      hidden ? null : (
        <Button
          key={index}
          {...props}
          onClick={() => {
            onClick();

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
