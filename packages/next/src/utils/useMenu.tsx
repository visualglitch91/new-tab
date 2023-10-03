import { Button, Stack } from "@mui/material";
import DialogBase from "../components/DialogBase";
import useModal from "./useModal";

export function useMenu() {
  const [mount, modals] = useModal();

  function showMenu<T extends string>({
    title,
    options,
    onSelect,
  }: {
    title: string;
    options: { value: T; label: string; hidden?: boolean; primary?: boolean }[];
    onSelect: (value: T) => void;
  }) {
    mount((_, props) => (
      <DialogBase title={title} {...props}>
        <Stack spacing={2}>
          {options.map((it) =>
            it.hidden ? null : (
              <Button
                key={it.value}
                variant={it.primary ? "contained" : "outlined"}
                onClick={() => {
                  props.onClose();
                  onSelect(it.value);
                }}
              >
                {it.label}
              </Button>
            )
          )}
          <Button onClick={props.onClose}>Cancelar</Button>
        </Stack>
      </DialogBase>
    ));
  }

  return [showMenu, modals] as const;
}
