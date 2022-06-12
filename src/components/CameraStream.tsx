import Hls from "hls.js";
import { useEffect, useRef } from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import { fetchStreamUrl, hassUrl } from "../utils/hass";

export default function CameraStream({
  entityId,
  style,
  class: className,
}: {
  entityId: string;
  class?: string;
  style?: JSXInternal.CSSProperties;
}) {
  const hlsRef = useRef<Hls>();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const hls = new Hls();
    hlsRef.current = hls;

    return () => {
      hls.destroy();
    };
  }, []);

  useEffect(() => {
    fetchStreamUrl(entityId).then((url) => {
      if (!hlsRef.current || !videoRef.current) {
        return;
      }

      hlsRef.current.loadSource(`${hassUrl}${url}`);
      hlsRef.current.attachMedia(videoRef.current);
    });
  }, [entityId]);

  return <video style={style} class={className} ref={videoRef} autoPlay />;
}
