import { Schedule } from "@home-control/types/hass-scheduler";
import api from "../../utils/api";
import useModal from "../../utils/useModal";
import ScheduleDialog from "./ScheduleDialog";
import { queryClient } from "../../utils/queryClient";

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
      ).then(() => queryClient.invalidateQueries(["schedules"]));
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
