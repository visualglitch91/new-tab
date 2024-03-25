import { Schedule } from "$common/types/hass-scheduler";
import api from "$client/utils/api";
import useModal from "$client/utils/useModal";
import ScheduleDialog from "./ScheduleDialog";
import { queryClient } from "$client/utils/queryClient";

export default function useUpsertSchedule() {
  const mount = useModal();

  function onSave(unmount: () => void) {
    return function (
      schedule: Omit<Schedule, "id" | "enabled"> & { id?: string }
    ) {
      unmount();
      (schedule.id
        ? api(`/hass-scheduler/schedule/${schedule.id}`, "patch", schedule)
        : api("/hass-scheduler/schedule", "post", schedule)
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
