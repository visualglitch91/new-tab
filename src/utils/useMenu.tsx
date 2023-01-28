import BorderButton from "../components/BorderButton";
import DialogBase from "../components/DialogBase";
import Stack from "../components/Stack";
import useModal from "./useModal";

export function useMenu() {
  const [mount, modals] = useModal();

  function showMenu<T extends string>({
    title,
    options,
    onSelect,
  }: {
    title: string;
    options: { value: T; label: string }[];
    onSelect: (value: T) => void;
  }) {
    mount((unmount) => (
      <DialogBase title={title} onClose={unmount}>
        <Stack>
          {options.map((it) => (
            <BorderButton
              key={it.value}
              onTap={() => {
                unmount();
                onSelect(it.value);
              }}
            >
              {it.label}
            </BorderButton>
          ))}
          <BorderButton onTap={unmount}>Cancelar</BorderButton>
        </Stack>
      </DialogBase>
    ));
  }

  return [showMenu, modals] as const;
}
