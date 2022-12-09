import { useEffect, useRef } from "react";
import type RTCVideo from "../utils/RTCVideo";

export default function CameraStream({
  aspectRatio,
  entityId,
}: {
  aspectRatio: number;
  entityId: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

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

    document.addEventListener("pause", onHidden);
    document.addEventListener("resume", onVisible);
    document.addEventListener("visibilitychange", onVisibilityChange);

    import("../utils/RTCVideo")
      .then((res) => res.default)
      .then((Video) => {
        video = new Video(entityId);
        video.startStreaming();
        container.appendChild(video.getElement());
      });

    return () => {
      container.innerHTML = "";
      video?.stopStreaming();
      document.removeEventListener("pause", onHidden);
      document.removeEventListener("resume", onVisible);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [entityId]);

  return (
    <div style={{ aspectRatio: aspectRatio.toString() }} ref={containerRef} />
  );
}
