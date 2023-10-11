import { useEffect, useState } from "react";

async function drawImageGrid(srcs: string[]) {
  const images = await Promise.all(
    srcs.slice(0, 4).map(
      (src) =>
        new Promise<HTMLImageElement>((resolve) => {
          const image = new Image();
          image.src = src;
          image.onload = () => resolve(image);
        })
    )
  );

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const maxImagesPerRow = 2;
  const gap = 40;
  const margin = 20;
  const imageSize = 200;
  const canvasWidth = (imageSize + gap) * maxImagesPerRow + margin * 2 - gap;

  const canvasHeight =
    (imageSize + gap) * Math.ceil(images.length / maxImagesPerRow) +
    margin * 2 -
    gap;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < images.length; i++) {
    const x = margin + (i % maxImagesPerRow) * (200 + gap);
    const y = margin + Math.floor(i / maxImagesPerRow) * (200 + gap);

    ctx.save();
    ctx.beginPath();
    ctx.arc(x + 100, y + 100, 100, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(images[i], x, y, 200, 200);
    ctx.restore();
  }

  return canvas.toDataURL();
}

export default function FolderIcon({ icons }: { icons: string[] }) {
  const [image, setImage] = useState<string>();
  const iconsKey = JSON.stringify(icons);

  useEffect(() => {
    drawImageGrid(icons).then(setImage);
    //eslint-disable-next-line
  }, [iconsKey]);

  if (!image) {
    return null;
  }

  return <img src={image} alt="" />;
}
