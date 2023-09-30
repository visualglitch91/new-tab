import { styled } from "@mui/joy";
import { cx, uniqueClassName } from "../utils/styles";
import Button from "./Button";

const classes = { tabActive: uniqueClassName() };

const Tabs = styled("div")({
  display: "flex",
  width: "100%",
});

export const Tab = styled(Button)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary[400]}`,
  borderRadius: 0,
  flex: 1,
  padding: "8px",
  borderRightwidth: 0,

  "&:first-of-type": {
    borderTopLeftRadius: "4px",
    borderBottomLeftRadius: "4px",
  },

  "&:last-child": {
    borderTopRightRadius: "4px",
    borderBottomRightRadius: "4px",
    borderRightWidth: "1px",
  },

  [`&.${classes.tabActive}`]: {
    background: `${theme.palette.primary[400]} !important`,
    color: `#24324b !important`,
  },
}));

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
    <Tabs>
      {options.map((it) => {
        if (!it) {
          return null;
        }

        return (
          <Tab
            key={it.value}
            className={cx(value === it.value && classes.tabActive)}
            onClick={() => onChange(it.value)}
          >
            {it.label}
          </Tab>
        );
      })}
    </Tabs>
  );
}
