import { useEffect, useRef, useState } from "preact/hooks";
import { clsx } from "../utils/general";
import { useHass } from "../utils/hass";
import Stack from "../components/Stack";
import Paper from "../components/Paper";
import TitleCard from "../components/TitleCard";
import "./cameras.css";

function Camera({ entityId }: { entityId: string }) {
  const { states } = useHass();
  const [imageURL, setImageURL] = useState<string | undefined>();
  const [error, setError] = useState(false);
  const loading = !imageURL;
  const cameraName = entityId.split(".")[1];

  const isOnline =
    states[`binary_sensor.camera_${cameraName}_online`].state === "on";

  const isOnlineRef = useRef(isOnline);
  isOnlineRef.current = isOnline;

  useEffect(() => {
    let counter = 0;

    function updateImage() {
      if (isOnlineRef.current) {
        const url = states[entityId].attributes.entity_picture;
        setImageURL(`${url}&counter=${counter++}`);
      }
    }

    const interval = setInterval(updateImage, 5000);
    updateImage();

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Paper class="module__cameras__camera">
      <div class="module__cameras__camera__overlay">
        {!isOnline
          ? "Câmera Indisponível"
          : loading
          ? "Carregando..."
          : error
          ? "Câmera Indisponível"
          : undefined}
      </div>
      <img
        src={imageURL}
        class={clsx((error || loading) && "module__cameras__image--hidden")}
        onLoad={() => setError(false)}
        onError={() => setError(true)}
      />
    </Paper>
  );
}

export default (
  <Stack>
    <TitleCard title="Câmeras" />
    <Camera entityId="camera.192_168_0_44" />
    <Camera entityId="camera.192_168_0_45" />
  </Stack>
);
