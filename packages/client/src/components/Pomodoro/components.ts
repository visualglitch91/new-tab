import { ButtonBase, styled } from "@mui/material";
import ProgressRing from "../ProgressRing";

export const PROGRESS_RING_RADIUS = 30;
export const PROGRESS_RING_STROKE = 4;

export const statusSx = {
  focus: { background: "#e24298" },
  "short-break": { background: "#32bdda" },
  "long-break": { background: "#5bb768" },
};

export const Root = styled("div")(({ theme }) => ({
  padding: "0",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  transition: "background-color 210ms var(--tween), filter 210ms var(--tween)",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  "&:hover": {
    filter: "brightness(0.9)",
  },
}));

export const WidgetButton = styled(ButtonBase)({
  flex: "1",
  width: "100%",
  height: "100%",
  padding: "8px",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  columnGap: "12px",
});

export const ProgressRingWrapper = styled("div")({
  width: `${PROGRESS_RING_RADIUS * 2}px`,
  height: `${PROGRESS_RING_RADIUS * 2}px`,
  position: "relative",
  marginLeft: "-12px",
  marginBottom: "-1px",

  "& > *": {
    position: "absolute",
    top: 0,
    left: 0,
  },
});

export const IconWrapper = styled("div")({
  top: "50% !important",
  left: "50% !important",
  transform: "translate(-50%, -50%)",
  opacity: 0.7,
});

export const GhostProgressRing = styled(ProgressRing)({
  opacity: 0.2,
});

export const TimeRemaining = styled("div")({
  fontSize: "30px",
  fontWeight: 500,
  marginBottom: "4px",
  lineHeight: 1,
});

export const Cycles = styled("ul")({
  listStyle: "none",
  padding: 0,
  display: "flex",
  flexDirection: "row",
  gap: "8px",
  lineHeight: 0,
  margin: 0,

  "& i": {
    width: "12px",
    height: "12px",
    display: "inline-block",
    background: "#ffffff",
    borderRadius: "100%",
    opacity: 0.3,

    '&[data-active="true"]': {
      opacity: 0.7,
    },
  },
});
