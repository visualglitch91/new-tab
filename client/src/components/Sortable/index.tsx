import React, { Fragment, useEffect, useState } from "react";
import { find, findIndex, get } from "lodash";
import {
  DndContext,
  pointerWithin,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { insertAtIndex } from "$client/utils/array";
import SortableItem, {
  ItemRenderer,
  RefSetters,
  WrapperProps,
  HandleProps,
} from "./SortableItem";

export type { ItemRenderer, RefSetters, WrapperProps, HandleProps };

function parseOverObj(over: any, itemsByGroup: Record<string, any[]>) {
  if (!over) {
    return { overGroupId: null, overIndex: null };
  }

  const overGroupId = over.data.current
    ? over.data.current.sortable.containerId
    : over.id;

  const overIndex = over.data.current
    ? over.data.current.sortable.index
    : itemsByGroup[overGroupId].length;

  const overId = over.data.current?.sortable.items[overIndex] || null;

  return { overGroupId, overIndex, overId };
}

function DroppableContainer({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id });
  return <div ref={setNodeRef}>{children}</div>;
}

export default function Sortable<
  T extends { id: string },
  G extends { id: string; items: T[] }
>({
  groups,
  renderGroup,
  renderItem,
  onChange,
}: {
  groups: G[];
  renderGroup: (
    data: {
      index: number;
      group: G;
      hovered: boolean;
      activeItem: G["items"][number] | undefined;
    },
    children: React.ReactNode
  ) => React.ReactNode;
  renderItem: ItemRenderer<G["items"][number]>;
  onChange?: (data: {
    prev: { groupId: string; index: number };
    next: { groupId: string; index: number };
  }) => void;
}) {
  type I = G["items"][number];

  const [state, setState] = useState<{
    ended: boolean;
    active: { item: I; groupId: string };
    over: { index: number; groupId: string; itemId: string | null } | null;
  } | null>(null);

  const [cached, setCached] = useState(groups);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 100,
      },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const itemsByGroup = cached.reduce(
    (acc, it) => ({ ...acc, [it.id]: it.items }),
    {} as Record<string, I[]>
  );

  useEffect(() => {
    if (!state) {
      setCached(groups);
    }
  }, [state, groups]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={({ active }) => {
        if (state) {
          return;
        }

        const activeGroupId = get(active, "data.current.sortable.containerId");

        const activeItem = find(itemsByGroup[activeGroupId] || [], [
          "id",
          active.id,
        ]);

        setState({
          ended: false,
          active: { groupId: activeGroupId, item: activeItem! },
          over: null,
        });
      }}
      onDragOver={({ over }) => {
        if (state?.ended) {
          return;
        }

        const active = state!.active;
        const { overGroupId, overIndex, overId } = parseOverObj(
          over,
          itemsByGroup
        );

        setState({
          ended: false,
          active,
          over: overGroupId
            ? { groupId: overGroupId, itemId: overId, index: overIndex }
            : null,
        });
      }}
      onDragEnd={({ over }) => {
        const active = state?.active;
        const { overGroupId, overIndex, overId } = parseOverObj(
          over,
          itemsByGroup
        );

        if (!onChange || !active || overId === active.item.id) {
          setState(null);
          return;
        }

        const cappedOverIndex =
          active.groupId === overGroupId
            ? Math.min(overIndex, itemsByGroup[overGroupId].length - 1)
            : overIndex;

        setState({
          ended: true,
          active,
          over: { groupId: overGroupId, itemId: overId, index: overIndex },
        });

        if (overGroupId) {
          onChange({
            prev: {
              groupId: active.groupId,
              index: findIndex(itemsByGroup[active.groupId], [
                "id",
                active.item.id,
              ]),
            },
            next: {
              groupId: overGroupId,
              index: cappedOverIndex,
            },
          });
        }

        setState(null);
      }}
    >
      {groups.map((group, index) => {
        let items = itemsByGroup[group.id];

        if (state && state.over) {
          if (
            group.id === state.active.groupId &&
            group.id !== state.over?.groupId
          ) {
            items = items.filter((it) => it.id !== state.active.item.id);
          } else if (
            group.id !== state.active.groupId &&
            group.id === state.over.groupId
          ) {
            items = state.ended
              ? insertAtIndex(items, state.over.index, state.active.item)
              : [...items, state.active.item];
          } else if (
            state.ended &&
            group.id === state.active.groupId &&
            group.id === state.over.groupId
          ) {
            items = arrayMove(
              items,
              items.indexOf(state.active.item),
              state.over.index
            );
          }
        }

        if (!items || items.length === 0) {
          return null;
        }

        return (
          <DroppableContainer key={group.id} id={group.id}>
            {renderGroup(
              {
                index,
                group,
                hovered: group.id === state?.over?.groupId,
                activeItem: state?.active.item,
              },
              <SortableContext
                disabled={state?.ended}
                id={group.id}
                items={items}
              >
                {items.map((item) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    renderer={renderItem}
                  />
                ))}
              </SortableContext>
            )}
          </DroppableContainer>
        );
      })}
      <DragOverlay>
        {state?.active
          ? renderItem(
              state.active.item,
              { setHandleRef: () => {}, setWrapperRef: () => {} },
              {},
              {}
            )
          : null}
      </DragOverlay>
    </DndContext>
  );
}
