import { useState } from "react";
import BorderButton from "../components/BorderButton";
import DialogBase from "../components/DialogBase";
import Stack from "../components/Stack";
import TextField from "../components/TextField";
import useModal from "./useModal";

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
          <TextField
            key={index}
            autoFocus={index === 0}
            label={label}
            value={values[index]}
            onChange={(value) => {
              setValues((prev) => {
                const next = [...prev];
                next[index] = value;
                return next;
              });
            }}
          />
        ))}
        <br />
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
