import { useQuery } from "@tanstack/react-query";
import GlossyPaper from "../../../components/GlossyPaper";
import LinksGrid from "../../../components/LinksGrid";
import PageLayout from "../../components/PageLayout";
import PageTile from "../../components/PageTitle";

export default function AndroidLauncherAppsPage() {
  const { data = [] } = useQuery(["android-apps"], () => {
    return new Promise<{ name: string; href: string; icon: string }[]>(
      (resolve) => {
        const iframe = document.createElement("iframe");

        iframe.style.position = "absolute";
        iframe.style.top = "-99999px";
        iframe.style.left = "-99999px";
        iframe.style.width = "1px";
        iframe.style.height = "1px";
        iframe.src = "fully://launcher";

        document.body.appendChild(iframe);

        const onMessage = (event: { data: string }) => {
          try {
            const data = JSON.parse(event.data);

            if (data.message === "android-apps") {
              resolve(data.data);
              window.removeEventListener("message", onMessage);
              document.body.removeChild(iframe);
            }
          } catch (err) {}
        };

        window.addEventListener("message", onMessage);
      }
    );
  });

  return (
    <PageLayout header={<PageTile>Apps</PageTile>}>
      <GlossyPaper>
        <LinksGrid
          linkSx={{
            "& a img": { borderRadius: "100%", width: 52, height: 52 },
          }}
          items={data.map((it, index) => ({ ...it, id: `app-index-${index}` }))}
        />
      </GlossyPaper>
    </PageLayout>
  );
}
