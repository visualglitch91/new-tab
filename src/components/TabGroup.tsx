import { Tab, Tabs, TabsProps } from "@mui/material";

export default function TabGroup<T extends string>({
  options,
  value,
  onChange,
  ...props
}: {
  options: ({ value: T; label: string } | null)[];
  value: T;
  onChange: (value: T) => void;
} & Omit<TabsProps, "value" | "onChange">) {
  return (
    <Tabs {...props} value={value} onChange={(_, value) => onChange(value)}>
      {options.map((it) => {
        if (!it) {
          return null;
        }

        return <Tab key={it.value} label={it.label} value={it.value} />;
      })}
    </Tabs>
  );
}
