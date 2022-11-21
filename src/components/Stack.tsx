import styled from "@emotion/styled";

const Stack = styled("div")<{
  horizontal?: boolean;
  smallGap?: boolean;
}>`
  display: flex;
  grid-gap: ${(p) => (p.smallGap ? "8px" : "16px")};
  flex-direction: ${(p) => (p.horizontal ? "row" : "column")};
  flex: ${(p) => (p.horizontal ? 1 : "unset")};
`;

export default Stack;
