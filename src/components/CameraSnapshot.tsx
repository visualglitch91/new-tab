import { useEffect, useState } from "react";
import { hassUrl, useHass } from "../utils/hass";

export default function CameraSnapshot({
  entityId,
  className,
  onLoad,
  onError,
}: {
  entityId: string;
  className?: string;
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
      alt=""
      src={`${hassUrl}${imageURL}`}
      className={className}
      onLoad={onLoad}
      onError={onError}
    />
  );
}
