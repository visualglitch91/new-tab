import { forwardRef } from "react";
import { css, cx } from "../styling";

const classes = {
  wrapper: css`
    display: flex;
    grid-gap: 16px;
  `,
  horizontal: css`
    flex-direction: row;

    & > * {
      flex: 1;
    }
  `,
  vertical: css`
    flex-direction: column;
  `,
  smallGap: css`
    grid-gap: 8px;
  `,
  largeGap: css`
    grid-gap: 24px;
  `,
};

const Stack = forwardRef(function Stack(
  {
    className,
    horizontal,
    smallGap,
    largeGap,
    children,
  }: {
    className?: string;
    horizontal?: boolean;
    smallGap?: boolean;
    largeGap?: boolean;
    children: React.ReactNode;
  },
  ref: React.LegacyRef<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      className={cx(
        classes.wrapper,
        horizontal && classes.horizontal,
        !horizontal && classes.vertical,
        smallGap && classes.smallGap,
        largeGap && classes.largeGap,
        className
      )}
    >
      {children}
    </div>
  );
});

export default Stack;
