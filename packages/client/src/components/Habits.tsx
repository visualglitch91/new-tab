import { ButtonBase, styled } from "@mui/material";
import api from "../utils/api";
import useConfirm from "../utils/useConfirm";
import useTickTickData from "../utils/useTickTickData";
import Section from "./Section";
import Grid from "./Grid";
import GlossyPaper from "./GlossyPaper";
import { SxProps } from "../theme/utils";

const colors = {
  zeroed: "#ff5555",
  partial: "#f1fa8c",
  done: "#50fa7b",
};

const HabitItem = styled(ButtonBase)({
  gap: "8px",
  textAlign: "left",
  justifyContent: "space-between",
  background: "rgba(10,10,10,0.3)",
  borderRadius: 12,
  padding: "0px 16px",
  whiteSpace: "nowrap",
  "&:hover": {
    background: "rgba(0,0,0,0.35)",
  },
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
        <Grid gap={12} columnWidth={columnWidth} rowHeight={36}>
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
                <span
                  style={{ color: colors[stauts] }}
                >{`${item.value}/${item.goal}`}</span>
              </HabitItem>
            );
          })}
        </Grid>
      </GlossyPaper>
    </Section>
  );
}
