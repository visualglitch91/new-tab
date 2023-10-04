import { ReactNode } from "react";
import { Stack } from "@mui/material";
import SectionTitle from "./SectionTitle";

export default function Section({
  title,
  button,
  children,
}: {
  title: ReactNode;
  button?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Stack spacing={2}>
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
