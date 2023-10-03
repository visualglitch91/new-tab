import { Actions } from "@home-control/types/hass-scheduler";
import api from "../../utils/api";
import useModal from "../../utils/useModal";
import NewTimerDialog from "./NewTimerDialog";
import { queryClient } from "../../utils/queryClient";

export default function useAddTimer() {
  const [mount, modals] = useModal();

  function onSave(unmount: () => void) {
    return function (name: string, duration: number, actions: Actions) {
      unmount();
      api("/hass-scheduler/timers", "post", { name, duration, actions }).then(
        () => queryClient.invalidateQueries(["timers"])
      );
    };
  }

  function addTimer() {
    mount((_, props) => (
      <NewTimerDialog
        defaultName="Novo Timer"
        onSave={onSave(props.onClose)}
        {...props}
      />
    ));
  }

  return [addTimer, modals] as const;
}
