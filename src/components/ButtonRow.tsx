import "./ButtonRow.css";

export default function ButtonRow({
  children,
  height,
}: {
  children: React.ReactNode;
  height?: number;
}) {
  return (
    <div
      style={{ height: height && `${height}px` }}
      className="module__tv__button-row"
    >
      {children}
    </div>
  );
}
