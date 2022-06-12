import { useEffect, useState } from "preact/hooks";
import { hassUrl, useHass } from "../utils/hass";

export default function CameraSnapshot({
  entityId,
  class: className,
  onLoad,
  onError,
}: {
  entityId: string;
  class?: string;
  onLoad?: () => void;
  onError?: () => void;
}) {
  const { states } = useHass();
  const [imageURL, setImageURL] = useState<string | undefined>();
  const entityPicture = states[entityId].attributes.entity_picture;

  useEffect(() => {
    let counter = 0;

    function updateImage() {
      setImageURL(`${entityPicture}&counter=${counter++}`);
    }

    const interval = setInterval(updateImage, 5000);
    updateImage();

    return () => {
      clearInterval(interval);
    };
  }, [entityPicture]);

  return (
    <img
      src={`${hassUrl}${imageURL}`}
      class={className}
      onLoad={onLoad}
      onError={onError}
    />
  );
}
