import { ReactNode } from "react";
import { styled } from "@mui/joy";
import Grid from "./Grid";
import TitleCard from "./TitleCard";

const Title = styled(TitleCard)({ marginBottom: "16px" });

export default function GridLayout({
  title,
  // titleAction,
  children,
}: {
  title?: string;
  titleAction?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      {title && (
        <Title
          title={title}
          //action={titleAction}
        />
      )}
      <Grid gap={8} columnWidth={80}>
        {children}
      </Grid>
    </div>
  );
}
