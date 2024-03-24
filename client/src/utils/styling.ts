import { styled } from "@mui/material";

export function cx(...classNames: (string | null | undefined | false | 0)[]) {
  return classNames.filter(Boolean).join(" ");
}

const temp = styled("div")({});
type SX = NonNullable<React.ComponentProps<typeof temp>["sx"]>;

export function sxx(...args: (SX | null | undefined | false | 0 | "")[]) {
  return args
    .reduce(
      (acc, sx) => [...acc, ...(Array.isArray(sx) ? sx : [sx])],
      [] as SX[]
    )
    .filter(Boolean) as SX;
}
