import { h, useEffect, useState } from "../utils/preact.mjs";
import { css, clsx } from "../utils/general.mjs";
import { showMoreInfo, useHass } from "../utils/hass.mjs";
import Stack from "../components/Stack.mjs";
import Paper from "../components/Paper.mjs";
import TitleCard from "../components/TitleCard.mjs";

css(`
  .module__cameras__camera {
    position: relative;
    min-height: 200px;
    overflow: hidden;
  }

  .module__cameras__camera img {
    width: 100%;
  }

  .module__cameras__camera__overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    cursor: pointer;
    transition: background 70ms linear;
  }

  .module__cameras__camera__overlay:not(:empty) {
    backdrop-filter: blur(5px);
    background: rgba(60, 60, 60, 0.3);
  }

  .module__cameras__camera__overlay:not(:empty):hover {
    background: rgba(40, 40, 40, 0.3);
  }

  .module__cameras__camera__overlay:empty:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  .module__cameras__image--broken {
    opacity: 0;
  }
`);

function Camera({ entityId }) {
  const { states } = useHass();
  const [imageURL, setImageURL] = useState();
  const [error, setError] = useState(false);
  const loading = !imageURL;
  const cameraName = entityId.split(".")[1];

  const isOnline =
    states[`binary_sensor.camera_${cameraName}_online`].state === "on";

  useEffect(() => {
    let counter = 0;

    function updateImage() {
      const url = states[entityId].attributes.entity_picture;
      setImageURL(`${url}&counter=${counter++}`);
    }

    const interval = setInterval(updateImage, 5000);
    updateImage();

    return () => {
      clearInterval(interval);
    };
  }, []);

  return h`
    <${Paper} class="module__cameras__camera">
      <div
        class="module__cameras__camera__overlay"
        onClick=${() => showMoreInfo(entityId)}
      >
        ${
          !isOnline
            ? "Câmera Indisponível"
            : loading
            ? "Carregando..."
            : error
            ? "Câmera Indisponível"
            : undefined
        }
      </div>
      <img
        src=${imageURL}
        class=${clsx(error || (loading && "module__cameras__image--hidden"))}
        onLoad=${() => setError(false)}
        onError=${() => setError(true)}
      />
    </${Paper}>`;
}

const camerasModule = h`
  <${Stack}>
    <${TitleCard} title="Câmeras" />
    <${Camera} entityId="camera.192_168_0_44" />
    <${Camera} entityId="camera.192_168_0_45" />
  </${Stack}>
`;

export default camerasModule;
