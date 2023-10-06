import { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import Search from "../../../components/MediaCenter/Search";
import DialogBase, {
  DialogBaseControlProps,
} from "../../../components/DialogBase";

export default function SearchDialog(props: DialogBaseControlProps) {
  const [term, setTerm] = useState("");
  const [delayedTerm, setDelayedTerm] = useState(term);

  useEffect(() => {
    const timeout = setTimeout(setDelayedTerm, 700, term);
    return () => clearTimeout(timeout);
  }, [term]);

  return (
    <DialogBase
      {...props}
      title="Busca"
      footer={<Button onClick={props.onClose}>Cancelar</Button>}
    >
      <Box pt="12px" pb="4px" width="100%">
        <TextField
          fullWidth
          size="small"
          placeholder="Digite para pesquisar..."
          value={term}
          onChange={(e) => setTerm(e.currentTarget.value)}
        />
      </Box>
      <Box
        width="80vw"
        maxWidth="540px"
        maxHeight="60vh"
        overflow="auto"
        marginX="-16px"
      >
        <Search term={delayedTerm} />
      </Box>
    </DialogBase>
  );
}
