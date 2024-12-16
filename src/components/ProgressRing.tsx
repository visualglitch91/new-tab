import { styled } from "@mui/material";

const Circle = styled("circle")({
  transition: "stroke-dashoffset 0.35s",
  transform: "rotate(-90deg)",
  transformOrigin: "50% 50%",
});

export default function ProgressRing({
  stroke,
  radius,
  percent,
  className,
}: {
  stroke: number;
  radius: number;
  percent: number;
  className?: string;
}) {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;
  const strokeDashoffset = offset.toString();

  return (
    <svg height={radius * 2} width={radius * 2} className={className}>
      <Circle
        stroke="white"
        strokeDasharray={`${circumference} ${circumference}`}
        style={{ strokeDashoffset }}
        strokeWidth={stroke}
        fill="transparent"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  );
}
