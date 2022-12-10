import { ReactNode } from "react";
import { css, styled } from "../styling";
import Grid from "./Grid";
import TitleCard from "./TitleCard";

const Title = styled(
  TitleCard,
  css`
    margin-bottom: 16px;
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
      {title && <Title title={title} action={titleAction} />}
      <Grid gap={8} columnWidth={80}>
        {children}
      </Grid>
    </div>
  );
}
