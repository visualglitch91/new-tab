import Slider from "./Slider";
import Stack from "./Stack";

export default function LabeledSlider({
  label,
  ...props
}: { label: string } & React.ComponentProps<typeof Slider>) {
  return (
    <Stack smallGap>
      <label>{label}</label>
      <Slider {...props} />
    </Stack>
  );
}
