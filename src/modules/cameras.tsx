import Stack from "../components/Stack";
import TitleCard from "../components/TitleCard";
import TapoCamera from "../components/TapoCamera";

export default (
  <Stack>
    <TitleCard title="Câmeras" />
    <TapoCamera
      entityId="camera.quarto"
      aspectRatio={16 / 9}
      moveButtons={{
        up: "button.camera_quarto_move_up",
        down: "button.camera_quarto_move_down",
        left: "button.camera_quarto_move_left",
        right: "button.camera_quarto_move_right",
      }}
    />
    <TapoCamera
      entityId="camera.sala"
      aspectRatio={16 / 9}
      moveButtons={{
        up: "button.camera_sala_move_up",
        down: "button.camera_sala_move_down",
        left: "button.camera_sala_move_left",
        right: "button.camera_sala_move_right",
      }}
    />
  </Stack>
);
