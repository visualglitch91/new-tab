import { ReactNode } from "react";
import { Stack } from "@mui/material";
import { SxProps } from "$client/theme/utils";
import SectionTitle from "./SectionTitle";

export default function Section({
  sx,
  title,
  button,
  children,
}: {
  sx?: SxProps;
  title: ReactNode;
  button?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Stack sx={sx} spacing={2}>
      <SectionTitle>
        {button ? (
          <>
            <span>{title}</span>
            {button}
          </>
        ) : (
          title
        )}
      </SectionTitle>
      {children}
    </Stack>
  );
}
