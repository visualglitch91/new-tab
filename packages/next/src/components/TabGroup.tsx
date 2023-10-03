import { Tab, Tabs } from "@mui/material";

export default function TabGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: ({ value: T; label: string } | null)[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <Tabs value={value} onChange={(_, value) => onChange(value)}>
      {options.map((it) => {
        if (!it) {
          return null;
        }

        return <Tab key={it.value} label={it.label} value={it.value} />;
      })}
    </Tabs>
  );
}
