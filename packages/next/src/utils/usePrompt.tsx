import { useState } from "react";
import { Button, FormControl, FormLabel, Input, Stack } from "@mui/material";
import DialogBase, { DialogBaseControlProps } from "../components/DialogBase";
import useModal from "./useModal";

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
    <DialogBase title={title} {...props}>
      <Stack spacing={2}>
        {fields.map((label, index) => (
          <FormControl key={index}>
            <FormLabel>{label}</FormLabel>
            <Input
              autoFocus={index === 0}
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
        <Button
          color="primary"
          variant="contained"
          onClick={() => onConfirm(values)}
        >
          Confirmar
        </Button>
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

  return [prompt, modals] as const;
}
