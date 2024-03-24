import ActionSheet, { ActionMap } from "$client/components/ActionSheet";
import useModal from "./useModal";

export function useMenu() {
  const mount = useModal();

  function showMenu<T extends string>({
    title,
    description,
    options,
    hideCancelButton,
  }: {
    title?: string;
    description?: string;
    hideCancelButton?: boolean;
    options:
      | {
          key: T;
          label: string;
          hidden?: boolean;
          primary?: boolean;
          action: () => void;
        }[]
      | ActionMap<T>;
  }) {
    mount((_, props) => (
      <ActionSheet
        {...props}
        hideCancelButton={hideCancelButton}
        title={title}
        description={description}
        actions={
          Array.isArray(options)
            ? options.reduce(
                (acc, it) => ({
                  ...acc,
                  [it.key]: {
                    label: it.label,
                    hidden: it.hidden,
                    variant: it.primary ? "contained" : undefined,
                    action: it.action,
                  },
                }),
                {} as ActionMap<T>
              )
            : options
        }
      />
    ));
  }

  return showMenu;
}
