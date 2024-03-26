import offset from "mouse-event-offset";
import {
  Box,
  ClickAwayListener,
  Grow,
  Menu,
  MenuItem,
  MenuList,
  Popper,
  alpha,
  darken,
} from "@mui/material";
import ActionSheet, { ActionSheetProps } from "$client/components/ActionSheet";
import GlossyPaper from "$client/components/GlossyPaper";
import { useIsMobile } from "./general";
import useModal from "./useModal";
import { getConfig } from "./useConfig";

const enableBlur = !getConfig("disableBlurEffects");
const arrowHeight = 6;
const arrowWidth = 11;

export function useMenu() {
  const mount = useModal();
  const mobile = useIsMobile();

  function showMenu({
    mouseEvent,
    clickAnchor,
    title,
    description,
    options,
    hideCancelButton,
  }: {
    mouseEvent?: MouseEvent;
    clickAnchor?: boolean;
    title?: string;
    description?: string;
    hideCancelButton?: boolean;
    options: ActionSheetProps["actions"];
  }) {
    const clickedElement = mouseEvent?.target as HTMLElement | undefined;

    let anchorEl =
      clickAnchor && clickedElement
        ? (() => {
            const pos = offset(mouseEvent, document.body);
            const anchorEl = document.createElement("div");

            anchorEl.style.position = "absolute";
            anchorEl.style.left = pos[0] + "px";
            anchorEl.style.top = pos[1] + "px";
            document.body.appendChild(anchorEl);

            setTimeout(() => anchorEl.remove(), 10);

            return anchorEl;
          })()
        : clickedElement;

    mount((_, props) =>
      mobile || !anchorEl ? (
        <ActionSheet
          {...props}
          hideCancelButton={hideCancelButton}
          title={title}
          description={description}
          actions={options}
        />
      ) : (
        <Menu
          open={props.open}
          anchorEl={anchorEl}
          onClose={props.onClose}
          TransitionProps={props.TransitionProps}
          slotProps={{
            paper: {
              sx: (theme) => ({
                background: alpha(
                  theme.palette.white.main,
                  enableBlur ? 0.8 : 0.96
                ),
                backdropFilter: enableBlur ? "blur(20px)" : undefined,
              }),
            },
          }}
        >
          {options.map((it, index) =>
            it.hidden ? null : (
              <MenuItem
                dense
                sx={(theme) => ({
                  fontSize: 16,
                  px: 2.5,
                  color: theme.palette.white.contrastText,
                  "&:hover": {
                    background: "rgba(10, 10, 10, 0.1)",
                  },
                })}
                key={index}
                onClick={() => {
                  props.onClose();
                  it.onClick();
                }}
              >
                {it.label}
              </MenuItem>
            )
          )}
        </Menu>
      )
    );
  }

  return showMenu;
}
