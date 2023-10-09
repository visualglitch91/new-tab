import { SxProps } from "@mui/material";
import { useLongPress } from "@uidotdev/usehooks";
import { sxx } from "../../utils/styling";
import useConfirm from "../../utils/useConfirm";
import ProgressRing from "../ProgressRing";
import Icon from "../Icon";
import usePomodoro, { formatRemaining } from "./utils";
import {
  Cycles,
  GhostProgressRing,
  IconWrapper,
  PROGRESS_RING_RADIUS,
  PROGRESS_RING_STROKE,
  ProgressRingWrapper,
  Root,
  TimeRemaining,
  WidgetButton,
  statusSx,
} from "./components";

export default function Pomodoro({ sx }: { sx: SxProps }) {
  const [state, toggleRunning, restart] = usePomodoro();
  const confirm = useConfirm();

  const longPress = useLongPress(() => {
    confirm({
      title: "Reiniciar Pomodoro?",
      confirmLabel: "Reiniciar",
      onConfirm: () => restart(),
    });
  });

  if (!state) {
    return <Root />;
  }

  return (
    <Root sx={sxx(statusSx[state.status], sx)}>
      <WidgetButton {...longPress} onClick={toggleRunning}>
        <ProgressRingWrapper>
          <GhostProgressRing
            stroke={PROGRESS_RING_STROKE}
            radius={PROGRESS_RING_RADIUS}
            percent={100}
          />
          <ProgressRing
            stroke={PROGRESS_RING_STROKE}
            radius={PROGRESS_RING_RADIUS}
            percent={
              ((state.duration - state.remaining) / state.duration) * 100
            }
          />
          <IconWrapper>
            <Icon icon={state.running ? "pause" : "play"} size={24} />
          </IconWrapper>
        </ProgressRingWrapper>
        <div>
          <TimeRemaining>{formatRemaining(state.remaining)}</TimeRemaining>
          <Cycles>
            {new Array(4).fill(null).map((_, index) => (
              <li key={index}>
                <i data-active={index === state.cycleCount} />
              </li>
            ))}
          </Cycles>
        </div>
      </WidgetButton>
    </Root>
  );
}
