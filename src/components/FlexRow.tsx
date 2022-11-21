import styled from "@mui/material/styles/styled";

const FlexRow = styled("div")<{
  align?: "left" | "center" | "right";
  full?: boolean;
  wrap?: boolean;
}>`
  display: flex;
  grid-gap: 8px;
  justify-content: ${(p) =>
    p.align === "left"
      ? "flex-start"
      : p.align === "center"
      ? "center"
      : p.align === "right"
      ? "flex-end"
      : "unset"}
  flex-wrap: ${(p) => (p.wrap ? "wrap" : "unset")};
  width: ${(p) => (p.full ? "100%" : "unset")};
`;

export default FlexRow;
