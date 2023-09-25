import { styled } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import Paper from "./Paper";

const Wrapper = styled(Paper)({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 16px",
  columnGap: "8px",
});

const Title = styled("h2")({
  margin: 0,
  fontSize: "18px",
  lineHeight: "32px",
});

export default function TitleCard({
  sx,
  className,
  title,
  action,
}: {
  sx?: SxProps;
  className?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <Wrapper sx={sx} className={className}>
      <Title>{title}</Title>
      {action}
    </Wrapper>
  );
}
