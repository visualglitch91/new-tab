import { useEffect, useRef, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import type RTCVideo from "$app/utils/RTCVideo";

export default function CameraStream({
  aspectRatio,
  entityId,
}: {
  aspectRatio: number;
  entityId: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    let video: RTCVideo;

    function onVisible() {
      video?.startStreaming();
    }

    function onHidden() {
      video?.stopStreaming();
    }

    function onVisibilityChange() {
      if (document.hidden) {
        onHidden();
      } else {
        onVisible();
      }
    }

    function onLoadingChanged() {
      setLoading(video ? video.loading : true);
    }

    document.addEventListener("pause", onHidden);
    document.addEventListener("resume", onVisible);
    document.addEventListener("visibilitychange", onVisibilityChange);

    import("../utils/RTCVideo")
      .then((res) => res.default)
      .then((Video) => {
        video = new Video(entityId);
        video.startStreaming();
        video.on("loading-changed", onLoadingChanged);
        container.appendChild(video.getElement());
        onLoadingChanged();
      });

    return () => {
      container.innerHTML = "";
      video?.stopStreaming();
      video?.off("loading-changed", onLoadingChanged);
      document.removeEventListener("pause", onHidden);
      document.removeEventListener("resume", onVisible);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [entityId]);

  return (
    <Box
      sx={{
        aspectRatio: aspectRatio.toString(),
        width: "100%",
        position: "relative",
      }}
    >
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box sx={{ opacity: loading ? 0 : 1 }} ref={containerRef} />
    </Box>
  );
}
