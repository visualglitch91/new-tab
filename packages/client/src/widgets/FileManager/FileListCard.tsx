import { Tooltip } from "@mui/joy";
import { isTouchDevice, useResponsive } from "../../utils/general";
import ListItem from "../../components/ListItem";
import PillButton from "../../components/PillButton";
import ResponsiveCard from "../../components/ResponsiveCard";
import { Directory, Item } from "./utils";

export default function FileListCard({
  items,
  current,
  prev,
  onChangeDir,
  onOptions,
}: {
  items: Item[];
  current: Directory;
  prev?: Directory;
  onChangeDir: (dir: Directory) => void;
  onOptions: (item: Item) => void;
}) {
  const { isDesktop } = useResponsive();

  return (
    <ResponsiveCard
      title={
        <div
          style={{
            gap: 8,
            display: "flex",
            overflow: "hidden",
            alignItems: "center",
          }}
        >
          {prev && (
            <PillButton icon="arrow-left" onClick={() => onChangeDir(prev!)} />
          )}
          <Tooltip title={current.name}>
            <span
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {current.name}
            </span>
          </Tooltip>
        </div>
      }
      groups={[
        <div style={isDesktop ? { height: "460px", overflow: "auto" } : {}}>
          {items.map((item) => {
            const isDir = item.type === "dir";

            return (
              <Tooltip key={item.id} title={item.name}>
                <span>
                  <ListItem
                    sx={{
                      py: "8px",
                      "& [data-show-on-hover]": { opacity: 0 },
                      "&:hover [data-show-on-hover]": { opacity: 1 },
                    }}
                    icon={isDir ? "folder" : "file"}
                    label={item.name}
                    onSecondaryAction={
                      isDir
                        ? () => setTimeout(onChangeDir, 200, item)
                        : undefined
                    }
                    onLongPress={
                      isTouchDevice ? () => onOptions(item) : undefined
                    }
                  >
                    {!isTouchDevice && (
                      <span data-show-on-hover>
                        <PillButton
                          icon="dots-vertical"
                          onClick={() => onOptions(item)}
                        />
                      </span>
                    )}
                  </ListItem>
                </span>
              </Tooltip>
            );
          })}
        </div>,
      ]}
    />
  );
}
