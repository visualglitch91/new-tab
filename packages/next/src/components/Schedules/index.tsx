import { useQuery } from "@tanstack/react-query";
import { Schedule } from "@home-control/types/hass-scheduler";
import api from "../../utils/api";
import ScheduleItem from "./ScheduleItem";
import { queryClient } from "../../utils/queryClient";
import EmptyState from "../EmptyState";
import useUpsertSchedule from "./useUpsertSchedule";
import { List } from "@mui/material";
import GlossyPaper from "../GlossyPaper";

export default function Schedules() {
  const [upsertSchedule, modals] = useUpsertSchedule();

  const {
    data = [],
    refetch,
    isInitialLoading,
  } = useQuery(["schedules"], () =>
    api<Schedule[]>("/hass-scheduler/schedule", "get")
  );

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

  return (
    <>
      {modals}
      <List component={GlossyPaper}>
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
              onEdit={() => upsertSchedule(it)}
              onDelete={() => onDelete(it)}
            />
          ))
        )}
      </List>
    </>
  );
}
