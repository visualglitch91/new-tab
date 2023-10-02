import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { OmbiMedia } from "@home-control/types/ombi";
import api from "../../utils/api";
import MediaListCard from "./MediaListCard";
import PillButton from "../PillButton";
import { Input } from "@mui/joy";

export default function Trending() {
  const [searchMode, setSearchMode] = useState(false);
  const [term, setTerm] = useState("");
  const [delayedTerm, setDelayedTerm] = useState(term);

  const {
    data = [],
    isInitialLoading,
    isLoading,
  } = useQuery(
    searchMode ? ["ombi", "search", delayedTerm] : ["ombi", "trending"],
    searchMode
      ? ({ signal }) =>
          api<OmbiMedia[]>(
            `/ombi/search/${delayedTerm}`,
            "get",
            undefined,
            signal
          )
      : ({ signal }) =>
          api<OmbiMedia[]>("/ombi/trending", "get", undefined, signal),
    {
      refetchInterval: 20_000,
      enabled: searchMode ? !!delayedTerm : true,
    }
  );

  useEffect(() => {
    const timeout = setTimeout(setDelayedTerm, 700, term);
    return () => clearTimeout(timeout);
  }, [term]);

  return (
    <MediaListCard
      title={searchMode ? "Busca" : "Populares"}
      titleAction={
        <PillButton icon="magnify" onClick={() => setSearchMode(!searchMode)} />
      }
      items={data}
      loading={searchMode ? !!term && isLoading : isInitialLoading}
    >
      {searchMode && (
        <div style={{ marginTop: -8, padding: "0 16px" }}>
          <Input
            sx={{ boxShadow: "none" }}
            value={term}
            onChange={(e) => setTerm(e.currentTarget.value)}
          />
        </div>
      )}
    </MediaListCard>
  );
}
