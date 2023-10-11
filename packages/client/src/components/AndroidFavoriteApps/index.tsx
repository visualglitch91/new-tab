import { keyBy } from "lodash";
import { config } from "../../../../../config";
import useAndroidApps from "../../utils/useAndroidApps";
import useModal from "../../utils/useModal";
import GlossyPaper from "../GlossyPaper";
import DialogBase from "../DialogBase";
import LinksGrid, { Link } from "../LinksGrid";
import FolderIcon from "./FolderIcon";

const { favorites: favoriteApps } = config.android_launcher;

function AppsGrid({
  items,
  hideLabels,
}: {
  items: (Link | null)[];
  hideLabels?: boolean;
}) {
  return (
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
          background: "rgba(90,90,90,0.7)",
        },
        "& a span": hideLabels ? { display: "none !important" } : {},
      }}
      items={items.filter(Boolean) as Link[]}
    />
  );
}

export default function AndroidFavoriteApps() {
  const mount = useModal();
  const androidApps = keyBy(useAndroidApps(), "name");

  return (
    <GlossyPaper>
      <AppsGrid
        hideLabels
        items={favoriteApps.map((name, index) => {
          const id = `app-index-${index}`;

          if (Array.isArray(name)) {
            const apps = name.map((it) => androidApps[it]).filter(Boolean);

            if (apps.length === 0) {
              return null;
            }

            return {
              id,
              name: "",
              href: "",
              icon: <FolderIcon icons={apps.map((it) => it.icon)} />,
              onClick: () =>
                mount((_, props) => (
                  <DialogBase {...props} bottomMobileSheet>
                    <AppsGrid
                      items={apps.map((app, index) => ({
                        ...app,
                        id: `app-index-${index}`,
                        onClick: () => {
                          window.location.assign(app.href);
                          props.onClose();
                        },
                      }))}
                    />
                  </DialogBase>
                )),
            };
          }

          const app = androidApps[name];

          if (!app) {
            return null;
          }

          return { ...app, id };
        })}
      />
    </GlossyPaper>
  );
}
