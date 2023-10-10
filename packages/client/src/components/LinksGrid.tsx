import { uniqueId } from "lodash";
import { useLongPress } from "@uidotdev/usehooks";
import { ButtonBase, styled } from "@mui/material";
import Icon from "./Icon";
import { SxProps } from "../theme/utils";

export interface Link {
  id: string;
  name: string;
  href: string;
  icon: string;
}

const classNames = {
  linkTitle: uniqueId("link_"),
  addButton: uniqueId("link_"),
};

const Root = styled("ul")({
  margin: 0,
  padding: 26,
  listStyle: "none",
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gridGap: 28,

  "& li": { width: 90 },

  "& li a": {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  },

  [`& li img, & li a.${classNames.addButton}`]: {
    width: 90,
    height: 90,
    display: "block",
    margin: "0 auto 10px",
    borderRadius: 12,
    transition: "border-color 100ms linear",
    border: "2px solid transparent",
    boxSizing: "border-box",
    overflow: "hidden",
    boxShadow: "3px 3px 13px -6px rgba(14, 28, 42, 0.5)",
  },

  [`& li span.${classNames.linkTitle}`]: {
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "white",
    maxWidth: "100%",
    whiteSpace: "nowrap",
    fontSize: "12px",
    textAlign: "center",
    padding: "4px 8px",
    borderRadius: 8,
    transition: "text-shadow 100ms linear",
  },

  "& li a:hover img": {
    borderColor: "#bd206c",
    textShadow: "1px 1px 4px rgba(0, 0, 0, 0.7)",
  },

  [`& li a.${classNames.addButton}`]: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#282a36",
    backgroundColor: "rgba(100,100,100,0.3)",
    transitionProperty: "border-color, background-color",
    "&:hover": {
      borderColor: "#bd206c",
      backgroundColor: "rgba(150,150,150,0.5)",
    },
  },
});

function LinkItem({
  link,
  sx,
  target,
  onHold,
}: {
  link: Link;
  sx?: SxProps;
  target?: string;
  onHold: () => void;
}) {
  const longPress = useLongPress(() => onHold());

  return (
    <ButtonBase component="li" sx={sx}>
      <a {...longPress} href={link.href} target={target} rel="noreferrer">
        <img src={link.icon} alt="" />
        <span className={classNames.linkTitle}>{link.name}</span>
      </a>
    </ButtonBase>
  );
}

export default function LinksGrid({
  items,
  linkSx,
  target,
  onAdd,
  onHold,
}: {
  items: Link[];
  linkSx?: SxProps;
  target?: string;
  onAdd?: () => void;
  onHold?: (item: Link) => void;
}) {
  return (
    <Root>
      {items.map((item) => (
        <LinkItem
          key={item.id}
          sx={linkSx}
          link={item}
          target={target}
          onHold={() => onHold?.(item)}
        />
      ))}
      {onAdd && (
        <li>
          <ButtonBase
            component="a"
            role="button"
            href="#void"
            className={classNames.addButton}
            onClick={(e) => {
              e.preventDefault();
              onAdd();
            }}
          >
            <Icon icon="plus" size={32} />
          </ButtonBase>
        </li>
      )}
    </Root>
  );
}
