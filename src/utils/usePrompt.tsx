import { useState } from "react";
import { Button, TextField, Stack } from "@mui/material";
import DialogBase, { DialogBaseControlProps } from "$app/components/DialogBase";
import useModal from "./useModal";
import { isTouchDevice } from "./general";

//eslint-disable-next-line react-refresh/only-export-components
function Prompt({
  title,
  fields,
  onConfirm,
  ...props
}: {
  title: string;
  fields: string[];
  onConfirm: (values: string[]) => void;
} & DialogBaseControlProps) {
  const [values, setValues] = useState(() => fields.map(() => ""));

  return (
    <DialogBase
      title={title}
      {...props}
      footer={
        <Button
          color="primary"
          variant="contained"
          onClick={() => onConfirm(values)}
        >
          Confirmar
        </Button>
      }
    >
      <Stack spacing={2}>
        {fields.map((label, index) => (
          <TextField
            key={index}
            label={label}
            autoFocus={index === 0 && !isTouchDevice}
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
        ))}
      </Stack>
    </DialogBase>
  );
}

export function usePrompt() {
  const mount = useModal();

  function prompt({
    title,
    fields,
    onConfirm,
  }: {
    title: string;
    fields: string[];
    onConfirm: (values: string[]) => void;
  }) {
    mount((_, props) => (
      <Prompt
        {...props}
        title={title}
        fields={fields}
        onConfirm={(values) => {
          props.onClose();
          onConfirm(values);
        }}
      />
    ));
  }

  return prompt;
}
