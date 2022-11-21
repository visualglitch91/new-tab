import { clsx } from "../utils/general";
import "./Paper.css";

export default function Paper({
  className,
  children,
  style,
}: {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={style} className={clsx("component__paper", className)}>
      {children}
    </div>
  );
}
