import { useQuery } from "@tanstack/react-query";
import { Schedule } from "@home-control/types/hass-scheduler";
import api from "../../utils/api";
import useModal from "../../utils/useModal";
import PillButton from "../PillButton";
import ListCard from "../ListCard";
import ScheduleDialog from "./ScheduleDialog";
import ScheduleItem from "./ScheduleItem";
import { queryClient } from "../../utils/queryClient";
import EmptyState from "../EmptyState";

export default function Schedules() {
  const [mount, modals] = useModal();

  const {
    data = [],
    refetch,
    isInitialLoading,
  } = useQuery(["schedules"], () =>
    api<Schedule[]>("/hass-scheduler/schedule", "get")
  );

  function onSave(unmount: () => void) {
    return function (
      schedule: Omit<Schedule, "id" | "enabled"> & { id?: string }
    ) {
      unmount();
      (schedule.id
        ? api(`/hass-scheduler/schedule/${schedule.id}`, "patch", schedule)
        : api("/hass-scheduler/schedule", "post", schedule)
      ).then(() => refetch());
    };
  }

  function onPatch<K extends keyof Schedule>(
    item: Schedule,
    key: K,
    value: Schedule[K]
  ) {
    queryClient.setQueryData<Schedule[]>(["schedules"], (prev) => {
      const next = [...(prev || [])];

      next.forEach((it, index) => {
        if (it.id === item.id) {
          next[index] = { ...it };
          next[index][key] = value;
        }
      });

      return next;
    });
    api(`/hass-scheduler/schedule/${item.id}`, "patch", { [key]: value }).then(
      () => refetch()
    );
  }

  function onUpsert(item?: Schedule) {
    mount((unmount) => (
      <ScheduleDialog
        initialValues={item || { name: `Agendamento ${data.length + 1}` }}
        onSave={onSave(unmount)}
        onClose={unmount}
      />
    ));
  }

  function onDelete(item: Schedule) {
    queryClient.setQueryData<Schedule[]>(["schedules"], (prev) => {
      return (prev || []).filter((it) => it.id !== item.id);
    });

    api(`/hass-scheduler/schedule/${item.id}`, "delete").then(() => refetch());
  }

  return (
    <>
      {modals}
      <ListCard
        gap={0}
        title="Agendamentos"
        titleAction={<PillButton icon="plus" onClick={() => onUpsert()} />}
      >
        {data.length === 0 ? (
          <EmptyState
            loading={isInitialLoading}
            text="Nenhum agendamento criado"
          />
        ) : (
          data.map((it) => (
            <ScheduleItem
              key={it.id}
              schedule={it}
              onPatch={(key, value) => onPatch(it, key, value)}
              onEdit={() => onUpsert(it)}
              onDelete={() => onDelete(it)}
            />
          ))
        )}
      </ListCard>
    </>
  );
}
