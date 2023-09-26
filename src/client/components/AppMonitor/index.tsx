import { Fragment } from "react";
import { styled } from "@mui/joy";
import ListCard from "../ListCard";
import { ListDivider } from "../ComponentGroup";
import { useData, formatStackName } from "./utils";
import { AppItem } from "./AppItem";
import { useResponsive } from "../../utils/general";

const MobileStackTitle = styled("div")({
  color: "white",
  background: "transparent",
  textTransform: "capitalize",
  "&:not(:first-of-type)": { marginTop: "16px" },
});

export default function AppMonitor() {
  const { data } = useData();
  const { isMobile } = useResponsive();

  if (!data || data.length === 0) {
    return null;
  }

  if (isMobile) {
    return (
      <ListCard title="Apps">
        {data.map(([stack, apps]) => (
          <Fragment key={stack}>
            <MobileStackTitle>{formatStackName(stack)}</MobileStackTitle>
            <ListDivider />
            {apps.map((app) => (
              <AppItem key={`app-${app.id}`} app={app} />
            ))}
          </Fragment>
        ))}
      </ListCard>
    );
  }

  return (
    <>
      {data.map(([stack, apps]) => (
        <ListCard title={formatStackName(stack)} key={stack}>
          {apps.map((app) => (
            <AppItem key={`app-${app.id}`} app={app} />
          ))}
        </ListCard>
      ))}
    </>
  );
}
