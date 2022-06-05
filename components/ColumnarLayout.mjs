import {
  h,
  css,
  clsx,
  clamp,
  useRef,
  useEffect,
  useRerender,
} from "../utils.mjs";

const gutter = 16;
const minColumnWidth = 420;
const maxColumnWidth = 520;

css(`
  .component__columnar-layout {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .component__columnar-layout__column {
    display: flex;
    flex-direction: column;
    padding: 0 ${gutter / 2}px;
    row-gap: ${gutter}px;
  }
`);

export default function ColumnarLayout({ class: className, children }) {
  const nodeRef = useRef();
  const rerender = useRerender();
  const items = [...children].flat().filter(Boolean)

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

    const columnWidth = clamp(
      availableWidth / items.length,
      minColumnWidth + gutter,
      maxColumnWidth + gutter
    );

    const columnCount = Math.max(1, Math.floor(availableWidth / columnWidth));
    const columnsContent = new Array(columnCount).fill(null).map(() => []);

    items.forEach((item, index) => {
      const columnIndex = index % columnCount;
      columnsContent[columnIndex].push(item);
    });

    const columnStyle = {
      width: columnCount === 1 ? "100%" : `${columnWidth}px`,
      maxWidth: `${maxColumnWidth}px`,
    };

    return columnsContent.map((content) =>
      content.length
        ? h`
          <div
            style=${columnStyle}
            class="component__columnar-layout__column"
          >
            ${content}
          </div>`
        : null
    );
  })();

  return h`
    <div ref=${nodeRef} class=${clsx("component__columnar-layout", className)}>
      ${columns}
    </div>
  `;
}
