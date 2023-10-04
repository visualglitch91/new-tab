import ActionSheet from "../components/ActionSheet";
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
        actions={{
          true: { label: confirmLabel },
          false: { label: cancelLabel },
        }}
        onSelect={(value) => {
          if (value === "true") {
            onConfirm();
          }

          props.onClose();
        }}
      />
    ));
  };
}
