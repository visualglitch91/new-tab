import { useState } from "react";
import Stack from "../components/Stack";
import TitleCard from "../components/TitleCard";
import Button from "../components/Button";
import Icon from "../components/Icon";
import TapoCamera from "../components/TapoCamera";

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
      <TapoCamera
        stream={stream}
        entityId="camera.quarto"
        moveButtons={{
          up: "button.camera_quarto_move_up",
          down: "button.camera_quarto_move_down",
          left: "button.camera_quarto_move_left",
          right: "button.camera_quarto_move_right",
        }}
      />
      <TapoCamera
        stream={stream}
        entityId="camera.sala"
        moveButtons={{
          up: "button.camera_sala_move_up",
          down: "button.camera_sala_move_down",
          left: "button.camera_sala_move_left",
          right: "button.camera_sala_move_right",
        }}
      />
    </Stack>
  );
}

export default <Cameras />;
