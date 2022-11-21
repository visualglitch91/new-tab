import { styled, css } from "../../utils/styling";

export const Wrapper = styled("div")<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  column-gap: 12px;

  ${(p) =>
    p.disabled
      ? css`
          opacity: 0.5;
          cursor: not-allowed;
        `
      : ""}
`;

export const IconWrapper = styled("div")`
  font-size: 24px;
  min-width: 40px;
  max-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${(p) =>
    p.onClick
      ? css`
          cursor: pointer;
          border-radius: 100%;
          transition: background 100ms linear;

          &:hover {
            background: rgba(255, 255, 255, 0.05);
          }
        `
      : ""}
`;

export const Label = styled("div")`
  margin-right: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  column-gap: 8px;
`;
