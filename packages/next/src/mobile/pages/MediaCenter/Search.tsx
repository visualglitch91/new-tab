import { useEffect, useState } from "react";
import { Box, TextField, alpha } from "@mui/material";
import PageLayout from "../../components/PageLayout";
import PageTile from "../../components/PageTitle";
import { borderRadius } from "../../../components/GlossyPaper";
import Search from "../../../components/MediaCenter/Search";

export default function SearchPage() {
  const [term, setTerm] = useState("");
  const [delayedTerm, setDelayedTerm] = useState(term);

  useEffect(() => {
    const timeout = setTimeout(setDelayedTerm, 700, term);
    return () => clearTimeout(timeout);
  }, [term]);

  return (
    <PageLayout
      header={
        <>
          <PageTile>Busca</PageTile>
          <Box pt="12px" pb="4px" width="100%">
            <TextField
              fullWidth
              size="small"
              placeholder="Digite para pesquisar..."
              value={term}
              onChange={(e) => setTerm(e.currentTarget.value)}
              sx={(theme) => ({
                "& .MuiInputBase-root": {
                  borderRadius,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: alpha(theme.palette.primary.light, 0.6),
                },
                "& .MuiInputBase-input": {
                  borderRadius,
                  backgroundColor: "rgba(47, 59, 82,0.6)",
                  boxShadow: "rgb(25, 25, 25) 3px 3px 13px -6px",
                },
              })}
            />
          </Box>
        </>
      }
    >
      <Search term={delayedTerm} />
    </PageLayout>
  );
}
