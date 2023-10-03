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
  onChangeDir,
  onOptions,
}: {
  items: Item[];
  current: Directory;
  prev?: Directory;
  onChangeDir: (dir: Directory) => void;
  onOptions: (item: Item) => void;
}) {
  return (
    <Stack spacing={2}>
      <GlossyPaper
        style={{
          gap: 8,
          display: "flex",
          overflow: "hidden",
          alignItems: "center",
        }}
      >
        {prev && (
          <AltIconButton onClick={() => onChangeDir(prev!)}>
            <Icon icon="arrow-left" />
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
      </GlossyPaper>

      <List component={GlossyPaper}>
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
                  onClick={isDir ? () => onChangeDir(item) : undefined}
                />
              </span>
            </Tooltip>
          );
        })}
      </List>
    </Stack>
  );
}
