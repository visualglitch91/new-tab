import { useCallback, useState } from "react";
import { FormControl, FormLabel, Input } from "@mui/joy";
import BorderButton from "../components/BorderButton";
import DialogBase from "../components/DialogBase";
import Stack from "../components/Stack";
import useModal from "./useModal";
import { focusOnRef } from "./react";

function Prompt({
  title,
  fields,
  onCancel,
  onConfirm,
}: {
  title: string;
  fields: string[];
  onCancel: () => void;
  onConfirm: (values: string[]) => void;
}) {
  const [values, setValues] = useState(() => fields.map(() => ""));

  return (
    <DialogBase title={title} onClose={onCancel}>
      <Stack>
        {fields.map((label, index) => (
          <FormControl key={index}>
            <FormLabel>{label}</FormLabel>
            <Input
              slotProps={
                index === 0 ? { input: { ref: focusOnRef } } : undefined
              }
              value={values[index]}
              onChange={(event) => {
                const value = event.currentTarget.value;

                setValues((prev) => {
                  const next = [...prev];
                  next[index] = value;
                  return next;
                });
              }}
            />
          </FormControl>
        ))}
        <BorderButton primary onClick={() => onConfirm(values)}>
          Confirmar
        </BorderButton>
      </Stack>
    </DialogBase>
  );
}

export function usePrompt() {
  const [mount, modals] = useModal();

  function prompt({
    title,
    fields,
    onConfirm,
  }: {
    title: string;
    fields: string[];
    onConfirm: (values: string[]) => void;
  }) {
    mount((unmount) => (
      <Prompt
        title={title}
        fields={fields}
        onCancel={unmount}
        onConfirm={(values) => {
          unmount();
          onConfirm(values);
        }}
      />
    ));
  }

  return [prompt, modals] as const;
}
