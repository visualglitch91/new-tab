import { css, cx, styled, theme, uniqueClassName } from "../styling";
import Button from "./Button";

const Tabs = styled(
  "div",
  css`
    display: flex;
    width: 100%;
  `
);

const classes = { tabActive: uniqueClassName() };

export const Tab = styled(
  Button,
  css`
    border: 1px solid ${theme.accent.base};
    border-radius: 0;
    flex: 1;
    padding: 8px;
    border-right-width: 0;

    &:first-child {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    &:last-child {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      border-right-width: 1px;
    }

    &.${classes.tabActive} {
      background: ${theme.accent.base} !important;
      color: #24324b !important;
    }
  `
);

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
            onTap={() => onChange(it.value)}
          >
            {it.label}
          </Tab>
        );
      })}
    </Tabs>
  );
}
