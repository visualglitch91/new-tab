import { useEffect, useId, useRef, useState } from "react";
import { Box, TextField, alpha } from "@mui/material";
import PageLayout from "../../components/PageLayout";
import PageTile from "../../components/PageTitle";
import Search from "../../../components/MediaCenter/Search";
import useMountEffect from "../../../utils/useMountEffect";

export default function SearchPage() {
  const id = useId();
  const searchFieldId = `${id}-search-field`;
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const [term, setTerm] = useState("");
  const [delayedTerm, setDelayedTerm] = useState(term);

  useEffect(() => {
    const timeout = setTimeout(setDelayedTerm, 700, term);
    return () => clearTimeout(timeout);
  }, [term]);

  useMountEffect(() => {
    const onScroll = () => {
      Array.from(
        document.querySelectorAll<HTMLInputElement>(
          `[data-input-id="${searchFieldId}"] input`
        )
      ).forEach((it) => {
        it.blur();
      });
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  });

  return (
    <PageLayout
      header={
        <>
          <PageTile>Busca</PageTile>
          <Box pt="12px" pb="4px" width="100%" ref={inputWrapperRef}>
            <TextField
              fullWidth
              size="small"
              placeholder="Digite para pesquisar..."
              value={term}
              data-input-id={searchFieldId}
              onChange={(e) => setTerm(e.currentTarget.value)}
              sx={(theme) => ({
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: alpha(theme.palette.primary.light, 0.6),
                },
                "& .MuiInputBase-input": {
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
