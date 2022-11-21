import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";
import { fetchStreamUrl, hassUrl } from "../utils/hass";

export default function CameraStream({
  entityId,
  style,
  className,
}: {
  entityId: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(!document.hidden);

  useEffect(() => {
    function onHidden() {
      setVisible(false);
    }

    function onVisible() {
      setVisible(true);
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

    return () => {
      document.removeEventListener("pause", onHidden);
      document.removeEventListener("resume", onVisible);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const hls = new Hls();

    fetchStreamUrl(entityId).then((url) => {
      if (!videoRef.current) {
        return;
      }

      hls.loadSource(`${hassUrl}${url}`);
      hls.attachMedia(videoRef.current);
    });

    return () => {
      hls.destroy();
    };
  }, [visible, entityId]);

  return visible ? (
    <video
      autoPlay
      controls
      style={{ ...style }}
      className={className}
      ref={videoRef}
    />
  ) : null;
}
