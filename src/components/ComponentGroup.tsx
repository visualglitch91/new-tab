import { useMemo } from "react";
import { styled, css, theme } from "../styling";
import { ComponentGroupProps } from "../utils/typings";
import { useResponsive } from "../utils/general";
import ListCard from "./ListCard";
import GridCard from "./GridCard";
import EntitiesSwitch from "./EntitiesSwitch";
import EntityButton from "./EntityButton";
import BaseEntityButton from "./BaseEntityButton";
import EntityListItem from "./EntityListItem";
import ListItem from "./ListItem";

export const ListDivider = styled(
  "div",
  css`
    height: 1px;
    background-color: ${theme.background.d10};
  `
);

export default function ComponentGroup({
  layout,
  title,
  items,
  titleAction,
  showGroupSwitch,
  extraGroupSwitchEntityIds = [],
}: ComponentGroupProps) {
  const { isDesktop } = useResponsive();

  const groupedEntityIds = items.reduce<string[]>((acc, item) => {
    const entityId =
      typeof item === "string"
        ? item
        : typeof item === "object" && item !== null && "entityId" in item
        ? !item.ignoreOnGroupSwitch && !(item.hiddenOnDesktop && isDesktop)
          ? item.entityId
          : undefined
        : undefined;

    const domain = entityId?.split(".")[0];

    if (domain && ["light", "switch", "input_boolean"].includes(domain)) {
      return [...acc, entityId];
    }

    return acc;
  }, extraGroupSwitchEntityIds);

  const groupSwitch = showGroupSwitch && groupedEntityIds.length > 0 && (
    <EntitiesSwitch entityIds={groupedEntityIds} />
  );

  const { Layout, EntityItem, BaseItem, divider } = useMemo(() => {
    return layout === "list"
      ? {
          Layout: ListCard,
          EntityItem: EntityListItem,
          BaseItem: ListItem,
          divider: <ListDivider />,
        }
      : {
          Layout: GridCard,
          EntityItem: EntityButton,
          BaseItem: BaseEntityButton,
          Divider: null,
        };
  }, [layout]);

  return (
    <Layout title={title} titleAction={titleAction || groupSwitch}>
      {items.map((raw) => {
        if (!raw || raw === true || typeof raw === "number") {
          return null;
        }

        if (raw === "divider") {
          return divider;
        }

        const item = typeof raw === "string" ? { entityId: raw } : raw;

        if ("hiddenOnDesktop" in item && isDesktop) {
          return null;
        }

        if ("entityId" in item) {
          return <EntityItem {...item} />;
        }

        if ("label" in item && "icon" in item) {
          return <BaseItem {...item} />;
        }

        if ("element" in item) {
          return item.element;
        }

        return item;
      })}
    </Layout>
  );
}
