import { SxProps } from "../../theme/utils";
import useTickTickData from "../../utils/useTickTickData";
import Section from "../Section";
import Grid from "../Grid";
import GlossyPaper from "../GlossyPaper";
import HabitItem from "./HabitItem";

export default function Habits({
  sx,
  columnWidth = 180,
}: {
  sx?: SxProps;
  columnWidth?: number;
}) {
  const { habits } = useTickTickData();

  return (
    <Section sx={sx} title="Hábitos">
      <GlossyPaper sx={{ padding: "16px" }}>
        <Grid gap={12} columnWidth={columnWidth} rowHeight={0}>
          {habits.map((item) => (
            <HabitItem key={item.habitId} item={item} />
          ))}
        </Grid>
      </GlossyPaper>
    </Section>
  );
}
