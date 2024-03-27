import { DraggableAttributes } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type SetNodeRef = (node: HTMLElement | null) => void;

export type WrapperProps = Partial<{ style: React.CSSProperties }>;

export type HandleProps = Partial<DraggableAttributes>;

export type RefSetters = {
  setHandleRef: SetNodeRef;
  setWrapperRef: SetNodeRef;
};

export type ItemRenderer<T extends { id: string }> = (
  item: T,
  refs: RefSetters,
  wrapperProps: WrapperProps,
  handleProps: HandleProps
) => React.ReactNode;

export default function SortableItem<T extends { id: string }>({
  item,
  renderer,
}: {
  item: T;
  renderer: ItemRenderer<T>;
}) {
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  return renderer(
    item,
    { setWrapperRef: setNodeRef, setHandleRef: setActivatorNodeRef },
    {
      style: {
        opacity: isDragging ? 0.4 : undefined,
        transition,
        transform: CSS.Transform.toString(transform),
      },
    },
    { ...attributes, ...listeners }
  );
}
