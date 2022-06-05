import { clsx, css } from "../utils/general.mjs";
import { h, useEffect, useState } from "../utils/preact.mjs";

css(`
  .component__svg-image svg {
    width: 100%;
    height: 100%;
  }
`);

export default function SvgImage({ class: className, style, src }) {
  const [image, setImage] = useState();

  useEffect(() => {
    fetch(src)
      .then((res) => res.text())
      .then(setImage);
  }, [src]);

  return h`
    <div
      style=${style}
      class=${clsx("component__svg-image", className)}
      dangerouslySetInnerHTML=${{ __html: image }}
    />
  `;
}
