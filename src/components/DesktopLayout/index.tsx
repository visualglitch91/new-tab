import { useEffect, useRef, useState, Children } from "react";
import { clamp } from "../../utils/general";
import { Wrapper, Columns, Column } from "./components";

const gutter = 16;
const minColumnWidth = 420;
const maxColumnWidth = 520;

export default function DesktopLayout({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [, setReady] = useState(false);
  const items = [...Children.toArray(children)].flat().filter(Boolean);
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
      .map(() => [] as React.ReactNode[]);

    items.forEach((item, index) => {
      const columnIndex = index % columnCount;
      columnsContent[columnIndex].push(item);
    });

    const columnStyle = {
      width: columnCount === 1 ? "100%" : `${columnWidth}px`,
      maxWidth: `${maxColumnWidth}px`,
    };

    return columnsContent.map((content) =>
      content.length ? <Column style={columnStyle}>{content}</Column> : null
    );
  })();

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <Wrapper>
      <Columns ref={nodeRef} className={className}>
        {columns}
      </Columns>
    </Wrapper>
  );
}
