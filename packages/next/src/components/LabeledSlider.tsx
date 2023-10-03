import { Stack, Typography } from "@mui/material";
import Slider from "./Slider";

export default function LabeledSlider({
  label,
  ...props
}: { label: string } & React.ComponentProps<typeof Slider>) {
  return (
    <Stack spacing={1}>
      <Typography>{label}</Typography>
      <Slider {...props} />
    </Stack>
  );
}
