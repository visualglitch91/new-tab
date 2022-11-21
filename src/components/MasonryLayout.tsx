//@ts-expect-error no typings for macy
import Macy from "macy";
import { Children, useCallback, useEffect, useRef, useState } from "react";
import { clsx, useDebouncedCallback } from "../utils/general";
import "./MasonryLayout.css";

const gutter = 16;
const columnWidth = 400;

function MasonryLayoutItem({
  children,
  onSizeChange,
}: {
  children: React.ReactNode;
  onSizeChange: () => void;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const onSizeChangeRef = useRef<() => void>(onSizeChange);

  useEffect(() => {
    onSizeChangeRef.current = onSizeChange;
  }, [onSizeChange]);

  useEffect(() => {
    const node = nodeRef.current;

    if (!node) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      onSizeChangeRef.current();
    });

    resizeObserver.observe(node);

    return () => {
      resizeObserver.observe(node);
    };
  }, []);

  return (
    <div ref={nodeRef} className="components__masonry-layout__item">
      {children}
    </div>
  );
}

export default function MasonryLayout({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const macyRef = useRef<any>();
  const nodeRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const items = [...Children.toArray(children)].flat().filter(Boolean);

  const getColumnCount = useCallback(() => {
    const availableWidth = nodeRef.current?.offsetWidth || 0;

    const columnCount = Math.max(
      1,
      Math.floor(availableWidth / (columnWidth + gutter))
    );

    return columnCount;
  }, []);

  const recalculateMacy = useCallback(() => {
    macyRef.current.options.columns = getColumnCount();
    macyRef.current.recalculate(true);
  }, [getColumnCount]);

  const onResize = useDebouncedCallback(recalculateMacy);

  useEffect(() => {
    macyRef.current = Macy({
      container: nodeRef.current!,
      columns: getColumnCount(),
    });

    const readyTimeout = window.setTimeout(setReady, 100, true);

    window.addEventListener("resize", onResize);

    return () => {
      window.clearTimeout(readyTimeout);
      window.removeEventListener("resize", onResize);
    };
    //eslint-disable-next-line
  }, []);

  return (
    <div
      style={{ opacity: ready ? 1 : 0 }}
      className={clsx("components__masonry-layout", className)}
    >
      <div ref={nodeRef}>
        {items.map((item, index) => (
          <MasonryLayoutItem key={index} onSizeChange={recalculateMacy}>
            {item}
          </MasonryLayoutItem>
        ))}
      </div>
    </div>
  );
}
