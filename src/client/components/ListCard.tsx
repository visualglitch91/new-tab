import { ReactNode } from "react";
import { styled } from "@mui/joy";
import Paper from "./Paper";

const Header = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 16px 0",
  columnGap: "8px",
});

const Heading = styled("h2")({
  margin: 0,
  fontSize: "18px",
  lineHeight: "32px",
});

const Content = styled("div")({
  display: "flex",
  flexDirection: "column",
  padding: "16px",
  rowGap: "8px",
});

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
