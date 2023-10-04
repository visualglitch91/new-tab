import { List, Stack, Tooltip } from "@mui/material";
import ListItem from "../ListItem";
import { Directory, Item } from "./utils";
import GlossyPaper from "../GlossyPaper";
import AltIconButton from "../AltIconButton";
import Icon from "../Icon";

export default function FileListCard({
  items,
  current,
  prev,
  maxHeight,
  onChangeDir,
  onOptions,
}: {
  items: Item[];
  current: Directory;
  prev?: Directory;
  maxHeight?: number;
  onChangeDir: (dir: Directory) => void;
  onOptions: (item: Item) => void;
}) {
  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        component={GlossyPaper}
        spacing={1}
        padding={1.5}
        sx={{
          overflow: "hidden",
          alignItems: "center",
          fontSize: "18px",
          fontWeight: 500,
          height: "56px",
        }}
      >
        {prev && (
          <AltIconButton size="small" onClick={() => onChangeDir(prev!)}>
            <Icon size={18} icon="arrow-left" />
          </AltIconButton>
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
      </Stack>

      <List
        component={GlossyPaper}
        sx={maxHeight ? { maxHeight, overflow: "auto" } : {}}
      >
        {items.map((item) => {
          const isDir = item.type === "dir";

          return (
            <Tooltip key={item.id} title={item.name}>
              <span>
                <ListItem
                  sx={{
                    "& [data-show-on-hover]": { opacity: 0 },
                    "&:hover [data-show-on-hover]": { opacity: 1 },
                  }}
                  icon={isDir ? "folder" : "file"}
                  primaryText={item.name}
                  endSlot={
                    <AltIconButton onClick={() => onOptions(item)}>
                      <Icon icon="dots-vertical" />
                    </AltIconButton>
                  }
                  onClick={
                    isDir ? () => setTimeout(onChangeDir, 200, item) : undefined
                  }
                />
              </span>
            </Tooltip>
          );
        })}
      </List>
    </Stack>
  );
}
