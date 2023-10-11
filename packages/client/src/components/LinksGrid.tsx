import { uniqueId } from "lodash";
import { useLongPress } from "@uidotdev/usehooks";
import { Box, ButtonBase, ButtonBaseProps, styled } from "@mui/material";
import Icon from "./Icon";
import { SxProps } from "../theme/utils";
import { sxx } from "../utils/styling";

export interface Link {
  id: string;
  name: string;
  href: string;
  icon: string | React.ReactNode;
  onClick?: () => void;
}

const classNames = {
  linkTitle: uniqueId("link_"),
  addButton: uniqueId("link_"),
};

const Root = styled("ul")({
  margin: 0,
  padding: 0,
  listStyle: "none",
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",

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

  const props: ButtonBaseProps = link.onClick
    ? {
        //@ts-expect-error
        href: "#void",
        role: "button",
        onClick: (e) => {
          e.preventDefault();
          link.onClick?.();
        },
      }
    : {
        href: link.href,
        target: target,
        rel: "noreferrer",
      };

  return (
    <Box component="li" sx={sx}>
      <ButtonBase component="a" {...props} {...longPress}>
        {typeof link.icon === "string" ? (
          <img src={link.icon} alt="" />
        ) : (
          link.icon
        )}
        <span className={classNames.linkTitle}>{link.name}</span>
      </ButtonBase>
    </Box>
  );
}

export default function LinksGrid({
  items,
  gap = "28px",
  sx,
  linkSx,
  target,
  onAdd,
  onHold,
}: {
  items: Link[];
  gap?: number | string;
  sx?: SxProps;
  linkSx?: SxProps;
  target?: string;
  onAdd?: () => void;
  onHold?: (item: Link) => void;
}) {
  return (
    <Root sx={sxx({ gap }, sx)}>
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
