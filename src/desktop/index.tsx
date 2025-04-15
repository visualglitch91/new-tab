import { Route, Switch } from "wouter";
import { alpha, Paper, styled } from "@mui/material";
import { useIsAdmin } from "$app/utils/hass";
import DesktopPage from "../components/DesktopPage";
import StatusBar from "./StatusBar";
import DesktopStyles from "./DesktopStyles";
import routes from "./routes";

const Wrapper = styled("div")({
  height: "70%",
  maxHeight: 980,
  width: "90%",
  maxWidth: 1920,
  position: "relative",
});

const Content = styled(Paper)(({ theme }) => ({
  borderRadius: 12,
  height: "100%",
  width: "100%",
  overflow: "hidden",
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: "blur(10px)",
}));

export default function NextRoutes() {
  const isAdmin = useIsAdmin();

  return (
    <Wrapper>
      <DesktopStyles />
      <Content>
        <Switch>
          {routes.map((page) =>
            page.admin && !isAdmin ? null : (
              <Route key={page.path} path={page.path}>
                <DesktopPage
                  component={page.component}
                  color={page.color}
                  label={page.label}
                  banner={page.banner}
                />
              </Route>
            )
          )}
        </Switch>
      </Content>
      <StatusBar />
    </Wrapper>
  );
}
