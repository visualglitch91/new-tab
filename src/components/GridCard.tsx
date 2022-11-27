import { ReactNode } from "react";
import { css, styled } from "../styling";
import TitleCard from "./TitleCard";

const Content = styled(
  "div",
  css`
    margin-top: 16px;
    display: grid;
    justify-content: center;
    grid-gap: 8px;
    grid-template-columns: repeat(auto-fill, minmax(min(80px, 100%), 1fr));
  `
);

export default function GridLayout({
  title,
  titleAction,
  children,
}: {
  title?: string;
  titleAction: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      {title && <TitleCard title={title} action={titleAction} />}
      <Content>{children}</Content>
    </div>
  );
}
