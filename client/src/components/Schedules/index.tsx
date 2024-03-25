import { List } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Schedule } from "$common/types/hass-scheduler";
import api from "$client/utils/api";
import { queryClient } from "$client/utils/queryClient";
import GlossyPaper from "../GlossyPaper";
import ScheduleItem from "./ScheduleItem";
import EmptyState from "../EmptyState";
import useUpsertSchedule from "./useUpsertSchedule";

export default function Schedules() {
  const upsertSchedule = useUpsertSchedule();

  const {
    data = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["schedules"],
    queryFn: () => api<Schedule[]>("/hass-scheduler/schedule", "get"),
  });

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

  function onDelete(item: Schedule) {
    queryClient.setQueryData<Schedule[]>(["schedules"], (prev) => {
      return (prev || []).filter((it) => it.id !== item.id);
    });

    api(`/hass-scheduler/schedule/${item.id}`, "delete").then(() => refetch());
  }

  function onRunNow(item: Schedule) {
    api(`/hass-scheduler/schedule/${item.id}/run-now`, "post");
  }

  return (
    <List component={GlossyPaper}>
      {data.length === 0 ? (
        <EmptyState loading={isLoading} text="Nenhum agendamento criado" />
      ) : (
        data.map((it) => (
          <ScheduleItem
            key={it.id}
            schedule={it}
            onPatch={(key, value) => onPatch(it, key, value)}
            onEdit={() => upsertSchedule(it)}
            onDelete={() => onDelete(it)}
            onRunNow={() => onRunNow(it)}
          />
        ))
      )}
    </List>
  );
}
