import { Box, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { Route, useLocation } from "wouter";
import { useBreakpoint } from "../../utils/general";
import Icon from "../../components/Icon";
import { useIsAdmin } from "../../utils/hass";

export default function TabLayout({
  tabs,
}: {
  tabs: {
    label: string;
    icon: React.ReactNode;
    path: string;
    admin?: boolean;
    component: React.ReactNode;
  }[];
}) {
  const { isMobileExternalDisplay } = useBreakpoint();
  const [location, navigate] = useLocation();
  const isAdmin = useIsAdmin();

  return (
    <Box>
      <Box zIndex={1}>
        {tabs.map((it) => (
          <Route key={it.path} path={it.path}>
            {it.component}
          </Route>
        ))}
      </Box>
      {tabs.length && (
        <>
          <Box sx={{ height: "70px" }} />
          <Box
            sx={{
              zIndex: 2,
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <BottomNavigation
              sx={
                isMobileExternalDisplay
                  ? {
                      height: "48px",
                      "& .MuiBottomNavigationAction-label": {
                        fontWeight: 600,
                        fontSize: 15,
                      },
                    }
                  : {}
              }
              value={location}
              showLabels={isMobileExternalDisplay}
              onChange={(_, path) => navigate(path)}
            >
              {tabs.map((it) => {
                if (it.admin && !isAdmin) {
                  return null;
                }

                return (
                  <BottomNavigationAction
                    key={it.path}
                    value={it.path}
                    label={it.label}
                    icon={
                      isMobileExternalDisplay ? null : typeof it.icon ===
                        "string" ? (
                        <Icon icon={it.icon} />
                      ) : (
                        it.icon
                      )
                    }
                  />
                );
              })}
            </BottomNavigation>
          </Box>
        </>
      )}
    </Box>
  );
}
