import {
  Children,
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useDebouncedCallback } from "../utils/general";
import { styled } from "@mui/joy";

const gutter = 16;
const smallerColumnWidth = 300;
const largerColumnWidth = 400;

const Wrapper = styled("div")({
  padding: "8px",
  transition: "opacity 70ms linear",
});

export default function MasonryLayout({
  className,
  items: _items,
}: {
  className?: string;
  items: (React.ReactNode | false | undefined | null)[];
}) {
  const macyRef = useRef<any>();
  const nodeRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const items = [...Children.toArray(_items)].flat().filter(Boolean);

  const getColumnCount = useCallback(() => {
    const availableWidth = nodeRef.current?.offsetWidth || 0;
    const columnWidth =
      window.innerWidth < 700 ? smallerColumnWidth : largerColumnWidth;

    const columnCount = Math.max(
      1,
      Math.floor(availableWidth / (columnWidth + gutter))
    );

    return columnCount;
  }, []);

  const recalculateMacy = useCallback(() => {
    if (macyRef.current) {
      macyRef.current.options.columns = getColumnCount();
      macyRef.current.recalculate(true);
    }
  }, [getColumnCount]);

  const onResize = useDebouncedCallback(recalculateMacy);

  useEffect(() => {
    let readyTimeout: number;
    //@ts-expect-error no typings for macy
    import("macy").then(({ default: Macy }) => {
      macyRef.current = Macy({
        margin: { x: gutter, y: gutter },
        container: nodeRef.current!,
        columns: getColumnCount(),
      });

      readyTimeout = window.setTimeout(setReady, 50, true);

      window.addEventListener("resize", onResize);
    });

    const resizeObserver = new ResizeObserver(onResize);

    resizeObserver.observe(nodeRef.current!);

    return () => {
      window.clearTimeout(readyTimeout);
      window.removeEventListener("resize", onResize);
      resizeObserver.disconnect();
    };
    //eslint-disable-next-line
  }, []);

  return (
    <Wrapper style={{ opacity: ready ? 1 : 0 }} className={className}>
      <div ref={nodeRef}>
        {items.map((item, index) => (
          <Fragment key={index}>{item}</Fragment>
        ))}
      </div>
    </Wrapper>
  );
}
