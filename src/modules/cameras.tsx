import { useState } from "react";
import Stack from "../components/Stack";
import TitleCard from "../components/TitleCard";
import Button from "../components/Button";
import Icon from "../components/Icon";
import Camera from "../components/Camera";

function Cameras() {
  const [stream, setStream] = useState(false);

  return (
    <Stack>
      <TitleCard
        title="Câmeras"
        action={
          stream ? (
            <Button onTap={() => setStream(false)}>
              <Icon icon="stop" />
            </Button>
          ) : (
            <Button onTap={() => setStream(true)}>
              <Icon icon="play" />
            </Button>
          )
        }
      />
      <Camera stream={stream} entityId="camera.moto_one_hyper" />
      <Camera stream={stream} entityId="camera.ipega" />
    </Stack>
  );
}

export default <Cameras />;
