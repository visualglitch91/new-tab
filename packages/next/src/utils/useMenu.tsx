import ActionSheet, { ActionMap } from "../components/ActionSheet";
import useModal from "./useModal";

export function useMenu() {
  const mount = useModal();

  function showMenu<T extends string>({
    title,
    description,
    options,
    hideCancelButton,
    onSelect,
  }: {
    title: string;
    description?: string;
    hideCancelButton?: boolean;
    options:
      | { value: T; label: string; hidden?: boolean; primary?: boolean }[]
      | ActionMap<T>;
    onSelect: (value: T) => void;
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
                (acc, it) =>
                  it.hidden
                    ? acc
                    : {
                        ...acc,
                        [it.value]: {
                          label: it.label,
                          variant: it.primary ? "contained" : undefined,
                        },
                      },
                {} as ActionMap<T>
              )
            : options
        }
        onSelect={(value) => {
          if (value) {
            onSelect(value);
          }

          props.onClose();
        }}
      />
    ));
  }

  return showMenu;
}
