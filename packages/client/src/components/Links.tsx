import { uniqueId } from "lodash";
import { useLongPress } from "@uidotdev/usehooks";
import { ButtonBase, styled } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Bookmark } from "@home-control/types/bookmarks";
import { isNewTab } from "../utils/general";
import { usePrompt } from "../utils/usePrompt";
import useConfirm from "../utils/useConfirm";
import GlossyPaper from "./GlossyPaper";
import api from "../utils/api";
import Icon from "./Icon";
import { queryClient } from "../utils/queryClient";

const classNames = {
  linkTitle: uniqueId("link_"),
  addButton: uniqueId("link_"),
};

const LinksGrid = styled("ul")({
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

function LinkItem({ link }: { link: Bookmark }) {
  const confirm = useConfirm();

  const longPress = useLongPress(() => {
    confirm({
      title: `Deseja remover "${link.name}"?`,
      confirmLabel: "Remover",
      onConfirm: () => {
        api(`/bookmarks/${link.id}`, "delete").then(() => {
          queryClient.invalidateQueries(["bookmarks"]);
        });
      },
    });
  });

  return (
    <li>
      <a
        {...longPress}
        href={link.url}
        target={isNewTab ? "_parent" : "_blank"}
        rel="noreferrer"
      >
        <img src={link.icon} alt="" />
        <span className={classNames.linkTitle}>{link.name}</span>
      </a>
    </li>
  );
}

export default function Links() {
  const prompt = usePrompt();

  const { data: links } = useQuery(["bookmarks"], () =>
    api<Bookmark[]>("/bookmarks", "get")
  );

  function addLink() {
    prompt({
      title: "Adicionar Link",
      fields: ["Nome", "URL", "Ícone"],
      onConfirm: (values) => {
        if (values.every(Boolean)) {
          api("/bookmarks", "post", {
            name: values[0],
            url: values[1],
            icon: values[2],
          }).then(() => {
            queryClient.invalidateQueries(["bookmarks"]);
          });
        }
      },
    });
  }

  return (
    <GlossyPaper>
      <LinksGrid>
        {links?.map((link) => (
          <LinkItem key={link.id} link={link} />
        ))}
        <li>
          <ButtonBase
            component="a"
            role="button"
            href="#void"
            className={classNames.addButton}
            onClick={(e) => {
              e.preventDefault();
              addLink();
            }}
          >
            <Icon icon="plus" size={32} />
          </ButtonBase>
        </li>
      </LinksGrid>
    </GlossyPaper>
  );
}
