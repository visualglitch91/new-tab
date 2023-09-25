import { forwardRef } from "react";
import { cx } from "./utils";

type AbstractComponent =
  | keyof JSX.IntrinsicElements
  | React.JSXElementConstructor<any>;

type PropsOf<C extends AbstractComponent> = JSX.LibraryManagedAttributes<
  C,
  React.ComponentProps<C>
>;

type ComponentWithMergedClasses<C extends AbstractComponent> =
  React.ComponentType<PropsOf<C>> & {
    withComponent: <D extends AbstractComponent>(
      Component: D
    ) => ComponentWithMergedClasses<D>;
  };

export function styled<C extends AbstractComponent>(
  Component: C,
  ...classNames: string[]
) {
  //@ts-ignore
  const NewComponent: any = forwardRef(
    ({ className, ...props }: PropsOf<C>, ref: any) => (
      //@ts-ignore
      <Component
        {...props}
        ref={ref}
        className={cx(className, ...classNames)}
      />
    )
  );

  NewComponent.withComponent = function <C extends AbstractComponent>(
    Component: C
  ) {
    return styled(Component, ...classNames);
  };

  return NewComponent as ComponentWithMergedClasses<C>;
}
