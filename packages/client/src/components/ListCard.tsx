import { ReactNode } from "react";
import { styled } from "@mui/joy";
import Paper from "./Paper";
import { SxProps } from "@mui/joy/styles/types";
import TitleCard, { TitleCardProps } from "./TitleCard";
import Stack from "./Stack";
import { sxx } from "../utils/styles";

const Content = styled("div")({
  display: "flex",
  flexDirection: "column",
});

export default function ListCard({
  sx,
  title,
  titleSize,
  titleChildren,
  children,
  stickyMobileTitle,
  gap = "8px",
  contentPadding = "12px",
}: {
  sx?: SxProps;
  title?: ReactNode;
  titleSize?: TitleCardProps["size"];
  titleChildren?: ReactNode;
  children: ReactNode;
  stickyMobileTitle?: boolean;
  gap?: number | string;
  contentPadding?: number | string;
}) {
  return (
    <Stack>
      {Boolean(title) && (
        <TitleCard
          stickyMobileTitle={stickyMobileTitle}
          title={title}
          size={titleSize}
        >
          {titleChildren}
        </TitleCard>
      )}
      <Paper sx={sxx({ py: contentPadding }, sx)}>
        <Content sx={{ gap }}>{children}</Content>
      </Paper>
    </Stack>
  );
}
