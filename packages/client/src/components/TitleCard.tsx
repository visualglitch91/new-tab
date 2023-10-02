import { styled } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import StickMobileHeader from "./StickMobileHeader";
import { useResponsive } from "../utils/general";

const Wrapper = styled("div")({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: "0",
  gap: "8px",
  zIndex: 2,
});

const Title = styled("h2")({
  margin: 0,
  fontWeight: 600,
});

const mobileSizes = {
  sm: "18px",
  md: "24px",
  lg: "32px",
};

const desktopSizes = mobileSizes;

export interface TitleCardProps {
  size?: "sm" | "md" | "lg";
  sx?: SxProps;
  className?: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  stickyMobileTitle?: boolean;
}

export default function TitleCard({
  sx,
  size = "md",
  className,
  title,
  children,
  stickyMobileTitle,
}: TitleCardProps) {
  const { isMobile } = useResponsive();

  const element = (
    <Wrapper sx={sx} className={className}>
      <Title sx={{ fontSize: (isMobile ? mobileSizes : desktopSizes)[size] }}>
        {title}
      </Title>
      {children}
    </Wrapper>
  );

  if (stickyMobileTitle) {
    return <StickMobileHeader>{element}</StickMobileHeader>;
  }

  return element;
}
