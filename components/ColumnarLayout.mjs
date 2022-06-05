import { h, clsx, css, useEffect, useRerender, useRef } from "../utils.mjs";

css(`
  .component__columnar-layout {
    display: flex;
  }

  .component__columnar-layout__column {
    display: flex;
    flex-direction: column;
    padding: 0 8px;
    row-gap: 16px;
  }
`);

export default function ColumnarLayout({
  class: className,
  columnCount: maxColumnCount,
  children: items,
}) {
  const nodeRef = useRef();
  const rerender = useRerender();

  useEffect(() => {
    rerender();
    window.addEventListener("resize", rerender);

    return () => {
      window.removeEventListener("resize", rerender);
    };
  }, []);

  const availableWidth = nodeRef.current?.offsetWidth;

  const columns = (() => {
    if (!availableWidth) {
      return;
    }

    const columnCount = Math.min(items.length, maxColumnCount);
    const columnWidth = availableWidth / columnCount;
    const columnsContent = new Array(columnCount).fill([]);

    items.forEach((item, index) => {
      const columnIndex = index % columnCount;
      columnsContent[columnIndex].push(item);
    });

    return columnsContent.map(
      (content) => h`
        <div
          ref=${nodeRef}
          style=${{ width: `${columnWidth}px` }}
          class="component__columnar-layout__column"
        >
          ${content}
        </div>
      `
    );
  })();

  return h`
    <div ref=${nodeRef} class=${clsx("component__columnar-layout", className)}>
      ${columns}
    </div>
  `;
}
