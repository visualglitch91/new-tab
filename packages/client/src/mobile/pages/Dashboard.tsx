import { Stack } from "@mui/material";
import useAndroidApps from "../../utils/useAndroidApps";
import GlossyPaper from "../../components/GlossyPaper";
import LinksGrid from "../../components/LinksGrid";
import { isAndroidLauncher } from "../../utils/general";
import { config } from "../../../../../config";
import { keyBy } from "lodash";
import PageLayout from "../components/PageLayout";
import ClockAndWeather from "../../components/ClockAndWeather";
import Forecast from "../../components/Forecast";

const { favorites: favoriteApps } = config.android_launcher;

export default function MobileDashboardPage() {
  const androidApps = keyBy(useAndroidApps(), "name");

  return (
    <PageLayout>
      <Stack spacing={5}>
        <ClockAndWeather />
        <Forecast days={3} />
        {isAndroidLauncher && (
          <GlossyPaper>
            <LinksGrid
              gap="16px"
              sx={{ pt: "16px", pb: "12px" }}
              linkSx={{
                "--size": "58px",
                "&": { width: "var(--size) !important" },
                "& a img": {
                  borderRadius: "100% !important",
                  width: "var(--size) !important",
                  height: "var(--size) !important",
                },
                "& a span": {
                  display: "none !important",
                },
              }}
              items={favoriteApps.map((name, index) => {
                const app = androidApps[name];
                return { ...app, id: `app-index-${index}` };
              })}
            />
          </GlossyPaper>
        )}
      </Stack>
    </PageLayout>
  );
}
