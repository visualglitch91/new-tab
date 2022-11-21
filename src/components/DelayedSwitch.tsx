import useAsyncChange from "../utils/useAsyncChange";
import DotLoading from "./DotLoading";
import Switch from "./Switch";

export default function DelayedSwitch({
  checked,
  delay,
  onInput,
}: {
  checked: boolean;
  delay: number;
  onInput: (e: React.FormEvent<HTMLInputElement>) => void;
}) {
  const { changingTo, changing, change } = useAsyncChange({
    flag: checked,
    timeout: delay,
  });

  if (changing) {
    return <DotLoading />;
  }

  return (
    <Switch
      disabled={changing}
      checked={
        changing && typeof changingTo !== "undefined" ? changingTo : checked
      }
      onInput={(e) => {
        if (change()) {
          onInput(e);
        }
      }}
    />
  );
}
