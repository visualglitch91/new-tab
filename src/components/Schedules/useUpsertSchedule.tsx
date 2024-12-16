import { Schedule } from "$app/types/hass-scheduler";
import api from "$app/utils/api";
import useModal from "$app/utils/useModal";
import ScheduleDialog from "./ScheduleDialog";
import { queryClient } from "$app/utils/queryClient";

export default function useUpsertSchedule() {
  const mount = useModal();

  function onSave(unmount: () => void) {
    return function (
      schedule: Omit<Schedule, "id" | "enabled"> & { id?: string }
    ) {
      unmount();
      (schedule.id
        ? api(`/schedule/${schedule.id}`, "patch", schedule)
        : api("/schedule", "post", schedule)
      ).then(() => queryClient.invalidateQueries({ queryKey: ["schedules"] }));
    };
  }

  return function upsertSchedule(item?: Schedule) {
    mount((_, props) => (
      <ScheduleDialog
        {...props}
        initialValues={item || { name: "Novo Agendamento" }}
        onSave={onSave(props.onClose)}
      />
    ));
  };
}
