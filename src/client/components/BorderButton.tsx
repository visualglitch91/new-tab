import { css, cx, theme } from "../styling";
import Button from "./Button";

const classes = {
  root: css`
    border: 1px solid ${theme.accent.base};
  `,
  primary: css`
    background: ${theme.accent.base};
    color: white;

    &:hover {
      background: ${theme.accent.d10};
      border-color: ${theme.accent.d10};
    }
  `,
};

export default function BorderButton({
  primary,
  className,
  ...props
}: React.ComponentProps<typeof Button> & { primary?: boolean }) {
  return (
    <Button
      {...props}
      className={cx(className, classes.root, primary && classes.primary)}
    />
  );
}
