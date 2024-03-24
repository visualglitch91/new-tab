import useModal from "$client/utils/useModal";
import NewTimerDialog from "./NewTimerDialog";

export default function useAddTimer() {
  const mount = useModal();

  function addTimer() {
    mount((_, props) => <NewTimerDialog defaultName="Novo Timer" {...props} />);
  }

  return addTimer;
}
