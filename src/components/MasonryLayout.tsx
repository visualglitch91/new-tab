//@ts-expect-error no typings for macy
import Macy from "macy";
import { ComponentChildren, toChildArray } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { clsx, useDebouncedCallback } from "../utils/general";
import "./MasonryLayout.css";

const gutter = 16;
const columnWidth = 400;

export default function MasonryLayout({
  class: className,
  children,
}: {
  class?: string;
  children: ComponentChildren;
}) {
  const macyRef = useRef<any>();
  const nodeRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const items = [...toChildArray(children)].flat().filter(Boolean);

  const getColumnCount = useCallback(() => {
    const availableWidth = nodeRef.current?.offsetWidth || 0;

    const columnCount = Math.max(
      1,
      Math.floor(availableWidth / (columnWidth + gutter))
    );

    return columnCount;
  }, []);

  const onResizeCallback = useDebouncedCallback(() => {
    macyRef.current.options.columns = getColumnCount();
    macyRef.current.recalculate(true);
  });

  useEffect(() => {
    macyRef.current = Macy({
      container: nodeRef.current!,
      columns: getColumnCount(),
    });

    const readyTimeout = window.setTimeout(setReady, 100, true);

    window.addEventListener("resize", onResizeCallback);

    return () => {
      window.clearTimeout(readyTimeout);
      window.removeEventListener("resize", onResizeCallback);
    };
    //eslint-disable-next-line
  }, []);

  return (
    <div
      style={{ opacity: ready ? 1 : 0 }}
      class={clsx("components__masonry-layout", className)}
    >
      <div ref={nodeRef}>
        {items.map((item, index) => (
          <div key={index} class="components__masonry-layout__item">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
