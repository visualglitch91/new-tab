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

export const scrollbarWidth = (() => {
  // Create a temporary div container
  const div = document.createElement("div");

  // Apply styles to force a scrollbar
  div.style.visibility = "hidden";
  div.style.overflow = "scroll"; // Force scrollbar
  div.style.width = "100px";
  div.style.height = "100px";

  // Append to the body
  document.body.appendChild(div);

  // Create an inner div and append to the container
  const innerDiv = document.createElement("div");
  innerDiv.style.width = "100%";
  div.appendChild(innerDiv);

  // Calculate the difference between the container's full width and the inner div's width
  const scrollbarWidth = div.offsetWidth - innerDiv.offsetWidth;

  // Remove the div from the document
  document.body.removeChild(div);

  return scrollbarWidth;
})();
