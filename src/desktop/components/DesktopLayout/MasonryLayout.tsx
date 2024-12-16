import {
  Children,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { styled } from "@mui/material";
import { useDebouncedCallback } from "$app/utils/useDebouncedCallback";

function calculateColumnCount(
  minWidth: number,
  maxWidth: number,
  availableWidth: number,
  gutterSize: number
) {
  let optimalCount = 1;
  let maxTotalWidth = 0;

  for (let width = minWidth; width <= maxWidth; width++) {
    const columnCount = Math.floor(
      (availableWidth + gutterSize) / (width + gutterSize)
    );
    const totalWidth = columnCount * width + (columnCount - 1) * gutterSize;

    if (totalWidth <= availableWidth && totalWidth > maxTotalWidth) {
      maxTotalWidth = totalWidth;
      optimalCount = columnCount;
    }
  }

  return optimalCount;
}

const Wrapper = styled("div")({
  transition: "opacity 70ms linear",
});

export default function MasonryLayout({
  className,
  items: _items,
  gutterSize = 20,
  minColumnWidth = 380,
  maxColumnWidth = 500,
}: {
  className?: string;
  items: (React.ReactNode | false | undefined | null)[];
  gutterSize?: number;
  minColumnWidth?: number;
  maxColumnWidth?: number;
}) {
  const macyRef = useRef<any>();
  const nodeRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const items = [...Children.toArray(_items)].flat().filter(Boolean);

  const getColumnCount = useCallback(() => {
    const availableWidth = nodeRef.current?.offsetWidth || 0;

    return calculateColumnCount(
      minColumnWidth,
      maxColumnWidth,
      availableWidth,
      gutterSize
    );
  }, [gutterSize, minColumnWidth, maxColumnWidth]);

  const recalculateMacy = useCallback(() => {
    if (macyRef.current) {
      macyRef.current.options.margin = { x: gutterSize, y: gutterSize };
      macyRef.current.options.columns = getColumnCount();
      macyRef.current.recalculate(true);
    }
  }, [gutterSize, getColumnCount]);

  const onResize = useDebouncedCallback(recalculateMacy);

  useEffect(() => {
    const node = nodeRef.current;

    if (!node) {
      return;
    }

    let readyTimeout: number;
    import("macy").then(({ default: Macy }) => {
      macyRef.current = Macy({
        margin: { x: gutterSize, y: gutterSize },
        container: node,
        columns: getColumnCount(),
      });

      readyTimeout = window.setTimeout(setReady, 50, true);

      window.addEventListener("resize", onResize);
    });

    const resizeObserver = new ResizeObserver(onResize);
    const mutationObserver = new MutationObserver(onResize);

    resizeObserver.observe(node);
    mutationObserver.observe(node, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(readyTimeout);
      window.removeEventListener("resize", onResize);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
    //eslint-disable-next-line
  }, []);

  return (
    <Wrapper
      style={ready ? {} : { opacity: 1, height: 0, overflow: "hidden" }}
      className={className}
    >
      <div ref={nodeRef}>
        {items.map((item, index) => (
          <Fragment key={index}>{item}</Fragment>
        ))}
      </div>
    </Wrapper>
  );
}
