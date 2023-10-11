import { sortBy } from "lodash";
import useAndroidApps from "../../../utils/useAndroidApps";
import GlossyPaper from "../../../components/GlossyPaper";
import LinksGrid from "../../../components/LinksGrid";
import PageLayout from "../../components/PageLayout";
import PageTile from "../../components/PageTitle";

export default function AndroidLauncherAppsPage() {
  const data = useAndroidApps();

  return (
    <PageLayout header={<PageTile>Apps</PageTile>}>
      <GlossyPaper
        sx={{
          padding: "24px 18px 20px",
          margin: "0 -16px -16px",
          borderRadius: 0,
        }}
      >
        <LinksGrid
          gap="32px"
          linkSx={{
            "--size": "58px",
            "&": { width: "var(--size) !important" },
            "& a img": {
              borderRadius: "100% !important",
              width: "var(--size) !important",
              height: "var(--size) !important",
              background: "rgba(90,90,90,0.7)",
            },
            "& a span": {
              width: "calc(var(--size) + 30px) !important",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
          }}
          items={sortBy(data, (it) => it.name.toLowerCase()).map(
            (it, index) => ({
              ...it,
              id: `app-index-${index}`,
            })
          )}
        />
      </GlossyPaper>
    </PageLayout>
  );
}
