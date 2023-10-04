import { forwardRef } from "react";
import { Slide } from "@mui/material";
import { type TransitionProps } from "@mui/material/transitions";

const DialogSlideTransition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default DialogSlideTransition;
