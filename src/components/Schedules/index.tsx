import { Divider, List } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Schedule } from "$app/types/hass-scheduler";
import api from "$app/utils/api";
import { queryClient } from "$app/utils/queryClient";
import useConfirm from "$app/utils/useConfirm";
import GlossyPaper from "../GlossyPaper";
import ScheduleItem from "./ScheduleItem";
import EmptyState from "../EmptyState";
import useUpsertSchedule from "./useUpsertSchedule";
import { Fragment } from "react/jsx-runtime";

export default function Schedules() {
  const upsertSchedule = useUpsertSchedule();
  const confirm = useConfirm();

  const {
    data = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["schedules"],
    queryFn: () => api<Schedule[]>("/schedule", "get"),
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
    api(`/schedule/${item.id}`, "patch", { [key]: value }).then(() =>
      refetch()
    );
  }

  function onDelete(item: Schedule) {
    confirm({
      title: "Deletar Agendamento",
      confirmLabel: "Deletar",
      onConfirm: () => {
        queryClient.setQueryData<Schedule[]>(["schedules"], (prev) => {
          return (prev || []).filter((it) => it.id !== item.id);
        });

        api(`/schedule/${item.id}`, "delete").then(() => refetch());
      },
    });
  }

  function onRunNow(item: Schedule) {
    api(`/schedule/${item.id}/run-now`, "post");
  }

  return (
    <List component={GlossyPaper}>
      {data.length === 0 ? (
        <EmptyState loading={isLoading} text="Nenhum agendamento criado" />
      ) : (
        data.map((it, index) => (
          <Fragment key={it.id}>
            <ScheduleItem
              schedule={it}
              onPatch={(key, value) => onPatch(it, key, value)}
              onEdit={() => upsertSchedule(it)}
              onDelete={() => onDelete(it)}
              onRunNow={() => onRunNow(it)}
            />
            {index < data.length - 1 && <Divider sx={{ my: 1.5 }} />}
          </Fragment>
        ))
      )}
    </List>
  );
}
