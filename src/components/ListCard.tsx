import { ReactNode } from "react";
import { styled, css } from "../styling";
import Paper from "./Paper";

const Header = styled(
  "div",
  css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px 0;
    column-gap: 8px;
  `
);

const Heading = styled(
  "h2",
  css`
    margin: 0;
    font-size: 18px;
    line-height: 32px;
  `
);

const Content = styled(
  "div",
  css`
    display: flex;
    flex-direction: column;
    padding: 16px 16px 16px;
    row-gap: 8px;
  `
);

export default function ListCard({
  title,
  titleAction,
  children,
}: {
  title?: string;
  titleAction?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Paper>
      {Boolean(title) && (
        <Header>
          <Heading>{title}</Heading>
          {titleAction}
        </Header>
      )}
      <Content>{children}</Content>
    </Paper>
  );
}
