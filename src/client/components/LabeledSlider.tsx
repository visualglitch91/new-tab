import { Typography } from "@mui/joy";
import Slider from "./Slider";
import Stack from "./Stack";

export default function LabeledSlider({
  label,
  ...props
}: { label: string } & React.ComponentProps<typeof Slider>) {
  return (
    <Stack smallGap>
      <Typography>{label}</Typography>
      <Slider {...props} />
    </Stack>
  );
}
