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
      <Camera stream={stream} cameraName="luatek_44" />
      <Camera stream={stream} cameraName="ipega_45" />
    </Stack>
  );
}

export default <Cameras />;
