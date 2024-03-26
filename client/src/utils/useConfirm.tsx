import ActionSheet from "$client/components/ActionSheet";
import useModal from "./useModal";

export default function useConfirm() {
  const mount = useModal();

  return function confirm({
    title,
    description,
    confirmLabel = "Continuar",
    cancelLabel = "Cancelar",
    onConfirm,
  }: {
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
  }) {
    return mount((_, props) => (
      <ActionSheet
        {...props}
        hideCancelButton
        title={title}
        description={description}
        actions={[
          { label: confirmLabel, onClick: onConfirm },
          { label: cancelLabel, onClick: props.onClose },
        ]}
      />
    ));
  };
}
