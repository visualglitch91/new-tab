import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MediaItem } from "@home-control/types/media-center";
import api from "../../utils/api";
import MediaListCard from "./MediaListCard";
import PillButton from "../PillButton";
import { Input } from "@mui/joy";
import { focusOnRef } from "../../utils/react";
import FlexRow from "../FlexRow";
import { alpha } from "../../utils/styles";

export default function Trending() {
  const [searchMode, setSearchMode] = useState(false);
  const [term, setTerm] = useState("");
  const [delayedTerm, setDelayedTerm] = useState(term);

  const {
    data = [],
    isInitialLoading,
    isLoading,
  } = useQuery(
    searchMode
      ? ["media-center", "search", delayedTerm]
      : ["media-center", "trending"],
    searchMode
      ? ({ signal }) =>
          api<MediaItem[]>(
            `/media-center/search/${delayedTerm}`,
            "get",
            undefined,
            { signal }
          )
      : ({ signal }) =>
          api<MediaItem[]>("/media-center/trending", "get", undefined, {
            signal,
          }),
    {
      refetchInterval: 20_000,
      enabled: searchMode ? !!delayedTerm : true,
    }
  );

  useEffect(() => {
    const timeout = setTimeout(setDelayedTerm, 700, term);
    return () => clearTimeout(timeout);
  }, [term]);

  useEffect(() => {
    setTerm("");
    setDelayedTerm("");
  }, [searchMode]);

  return (
    <MediaListCard
      title={searchMode ? "Busca" : "Populares"}
      titleAction={
        <FlexRow>
          {searchMode && (
            <Input
              sx={(theme) => ({
                boxShadow: "none",
                minHeight: "26px",
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                borderColor: alpha(theme.palette.primary[500], 0.5),
              })}
              size="sm"
              slotProps={{ input: { ref: focusOnRef } }}
              value={term}
              onChange={(e) => setTerm(e.currentTarget.value)}
            />
          )}
          <PillButton
            icon={searchMode ? "close" : "magnify"}
            onClick={() => setSearchMode(!searchMode)}
          />
        </FlexRow>
      }
      items={data}
      loading={searchMode ? !!term && isLoading : isInitialLoading}
    />
  );
}
