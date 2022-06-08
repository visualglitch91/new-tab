import { ComponentChildren } from "preact";
import "./ButtonRow.css";

export default function ButtonRow({
  children,
  height,
}: {
  children: ComponentChildren;
  height?: number;
}) {
  return (
    <div
      style={{ height: height && `${height}px` }}
      class="module__tv__button-row"
    >
      {children}
    </div>
  );
}
