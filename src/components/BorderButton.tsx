import { css, cx } from "../styling";
import Button from "./Button";

const classes = {
  root: css`
    border: 1px solid #f64270;
  `,
  primary: css`
    background: #f64270;
    color: white;

    &:hover {
      background: #c6355a;
      border-color: #c6355a;
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
