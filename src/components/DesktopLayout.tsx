import { ComponentChild, ComponentChildren, toChildArray } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { clsx, clamp } from "../utils/general";
import "./DesktopLayout.css";

const gutter = 16;
const minColumnWidth = 420;
const maxColumnWidth = 520;

export default function DesktopLayout({
  class: className,
  children,
}: {
  class?: string;
  children: ComponentChildren;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [, setReady] = useState(false);
  const items = [...toChildArray(children)].flat().filter(Boolean);
  const availableWidth = nodeRef.current?.offsetWidth;

  const columns = (() => {
    if (!availableWidth) {
      return;
    }

    const columnWidth = clamp(
      availableWidth / items.length,
      minColumnWidth + gutter,
      maxColumnWidth + gutter
    );

    const columnCount = Math.max(1, Math.floor(availableWidth / columnWidth));

    const columnsContent = new Array(columnCount)
      .fill(null)
      .map(() => [] as ComponentChild[]);

    items.forEach((item, index) => {
      const columnIndex = index % columnCount;
      columnsContent[columnIndex].push(item);
    });

    const columnStyle = {
      width: columnCount === 1 ? "100%" : `${columnWidth}px`,
      maxWidth: `${maxColumnWidth}px`,
    };

    return columnsContent.map((content) =>
      content.length ? (
        <div style={columnStyle} class="component__columnar-layout__column">
          {content}
        </div>
      ) : null
    );
  })();

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div ref={nodeRef} class={clsx("component__columnar-layout", className)}>
      {columns}
    </div>
  );
}
