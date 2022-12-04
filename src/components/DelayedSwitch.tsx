import useAsyncChange from "../utils/useAsyncChange";
import DotLoading from "./DotLoading";
import Switch from "./Switch";

export default function DelayedSwitch({
  checked,
  delay,
  loading,
  onInput,
}: {
  checked: boolean;
  loading?: boolean;
  delay: number;
  onInput: (e: React.FormEvent<HTMLInputElement>) => void;
}) {
  const { changingTo, changing, change } = useAsyncChange({
    flag: checked,
    timeout: delay,
  });

  if (loading || changing) {
    return <DotLoading />;
  }

  return (
    <Switch
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
