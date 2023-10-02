import { Fragment, useContext } from "react";
import { styled } from "@mui/joy";
import { useResponsive } from "../../utils/general";
import ListCard from "../ListCard";
import { alpha } from "../../utils/styles";
import Stack from "../Stack";
import TitleCard from "../TitleCard";
import Paper from "../Paper";
import { MultipleResponsiveCardContext, ResponsiveCardProps } from "./utils";
import FlexRow from "../FlexRow";

const Divider = styled("div")(({ theme }) => ({
  background: alpha(theme.palette.primary[400], 0.3),
  height: 1,
}));

const MobileGroup = styled(Paper)({
  padding: "12px 0",
  gap: 8,
});

export default function ResponsiveCard({
  title: _title,
  titleChildren,
  stickyMobileTitle: _stickyMobileTitle,
  largerMobileTitle: _largerMobileTitle,
  variant: _variant = "auto",
  groups,
  spacing,
  contentPadding,
}: ResponsiveCardProps) {
  const { isMobile } = useResponsive();
  const context = useContext(MultipleResponsiveCardContext);
  let title = _title;
  let stickyMobileTitle = _stickyMobileTitle;
  let largerMobileTitle = _largerMobileTitle;

  const variant =
    _variant === "auto" ? (isMobile ? "confortable" : "compact") : _variant;

  if (context) {
    title = (
      <FlexRow>
        {context.viewSwitcher}
        {_title}
      </FlexRow>
    );

    if (typeof context.stickyMobileTitle === "boolean") {
      stickyMobileTitle = context.stickyMobileTitle;
    }

    if (typeof context.largerMobileTitle === "boolean") {
      largerMobileTitle = context.largerMobileTitle;
    }
  }

  if (variant === "confortable") {
    return (
      <Stack>
        <TitleCard
          stickyMobileTitle={stickyMobileTitle}
          title={title}
          size={isMobile && largerMobileTitle ? "lg" : undefined}
        >
          {titleChildren}
        </TitleCard>
        {groups.map((it, index) => (
          <MobileGroup key={index} sx={{ py: spacing }}>
            {it}
          </MobileGroup>
        ))}
      </Stack>
    );
  }

  return (
    <ListCard
      stickyMobileTitle={stickyMobileTitle}
      title={title}
      titleChildren={titleChildren}
      titleSize={isMobile && largerMobileTitle ? "lg" : undefined}
      gap={spacing}
      contentPadding={contentPadding}
    >
      {groups.map((it, index) => (
        <Fragment key={index}>
          {index > 0 && index < groups.length && <Divider />}
          {it}
        </Fragment>
      ))}
    </ListCard>
  );
}
