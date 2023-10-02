import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MediaItem } from "@home-control/types/media-center";
import api from "../../utils/api";
import MediaListCard from "./MediaListCard";
import { Input } from "@mui/joy";
import { focusOnRef } from "../../utils/react";
import { alpha } from "../../utils/styles";
import { useResponsive } from "../../utils/general";

export default function Trending() {
  const [term, setTerm] = useState("");
  const [delayedTerm, setDelayedTerm] = useState(term);
  const { isMobile } = useResponsive();

  const {
    data = [],
    isInitialLoading,
    isLoading,
  } = useQuery(
    delayedTerm
      ? ["media-center", "search", delayedTerm]
      : ["media-center", "trending"],
    delayedTerm
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
    { refetchInterval: 20_000 }
  );

  useEffect(() => {
    const timeout = setTimeout(setDelayedTerm, 700, term);
    return () => clearTimeout(timeout);
  }, [term]);

  const searchInput = (
    <Input
      sx={(theme) => ({
        width: "100%",
        backgroundColor: "rgba(47, 59, 82,0.6)",
        boxShadow: "rgb(25, 25, 25) 3px 3px 13px -6px",
        borderColor: alpha(theme.palette.primary[500], 0.5),
      })}
      size="sm"
      placeholder="Buscar..."
      slotProps={{ input: { ref: focusOnRef } }}
      value={term}
      onChange={(e) => setTerm(e.currentTarget.value)}
    />
  );

  return (
    <MediaListCard
      title={term ? "Busca" : "Populares"}
      titleChildren={isMobile ? searchInput : undefined}
      items={data}
      loading={delayedTerm ? isLoading : isInitialLoading}
    >
      {isMobile ? undefined : (
        <div style={{ padding: "14px 12px 0" }}>{searchInput}</div>
      )}
    </MediaListCard>
  );
}
