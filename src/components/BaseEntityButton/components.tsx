import { styled, css } from "../../utils/styling";
import ButtonCard from "../ButtonCard";

export const Wrapper = styled(
  (props: React.ComponentProps<typeof ButtonCard>) => <ButtonCard {...props} />
)<{
  on: boolean;
  backgroundColor?: string;
}>`
  height: 75px;
  display: flex;
  flex-direction: column;
  row-gap: 6px;
  box-sizing: border-box;
  padding: 6px 8px;
  overflow: hidden;

  ${(p) =>
    p.on
      ? css`
          &.hover {
            background: rgba(255, 255, 255, 0.25);
          }
        `
      : ""}

  ${(p) =>
    p.backgroundColor
      ? css`
          background-color: ${p.backgroundColor};
        `
      : ""}

      ${(p) =>
    p.on && p.backgroundColor
      ? css`
          &.hover {
            background: unset;
            filter: brightness(1.1);
            border-color: rgba(255, 255, 255, 0.1);
          }
        `
      : ""}

      ${(p) =>
    p.on && !p.backgroundColor
      ? css`
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.1);
        `
      : ""}
`;

export const Label = styled("div")`
  font-size: 9px;
  font-weight: 700;
  white-space: pre-wrap;
`;
