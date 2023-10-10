import { ButtonBase, styled } from "@mui/material";
import { SxProps } from "../theme/utils";
import api from "../utils/api";
import useConfirm from "../utils/useConfirm";
import useTickTickData from "../utils/useTickTickData";
import Section from "./Section";
import Grid from "./Grid";
import GlossyPaper from "./GlossyPaper";
import DraculaChip, { Colors } from "./DraculaChip";

const colors = {
  zeroed: Colors.Red,
  partial: Colors.Yellow,
  done: Colors.Green,
};

const HabitItem = styled(ButtonBase)({
  gap: "8px",
  textAlign: "left",
  justifyContent: "space-between",
  background: "rgba(10,10,10,0.3)",
  borderRadius: 12,
  padding: "12px 16px",
  whiteSpace: "nowrap",
  "&:hover": { background: "rgba(0,0,0,0.35)" },
});

export default function Habits({
  sx,
  columnWidth = 180,
}: {
  sx?: SxProps;
  columnWidth?: number;
}) {
  const confirm = useConfirm();
  const { data, refetch } = useTickTickData();
  const items = data.habits;

  return (
    <Section sx={sx} title="Hábitos">
      <GlossyPaper sx={{ padding: "16px" }}>
        <Grid gap={12} columnWidth={columnWidth} rowHeight={0}>
          {items.map((item) => {
            const stauts =
              item.value >= item.goal
                ? "done"
                : item.value === 0
                ? "zeroed"
                : "partial";

            return (
              <HabitItem
                key={item.habitId}
                className="HabitItem-root"
                onClick={() => {
                  confirm({
                    title: "Marcar hábito?",
                    onConfirm: () => {
                      api("/ticktick/habits/checkin", "POST", {
                        habitId: item.habitId,
                      }).then(() => {
                        refetch();
                      });
                    },
                  });
                }}
              >
                {item.name}
                <DraculaChip
                  sx={{ fontWeight: 600 }}
                  color={colors[stauts]}
                  text={`${item.value}/${item.goal}`}
                />
              </HabitItem>
            );
          })}
        </Grid>
      </GlossyPaper>
    </Section>
  );
}
