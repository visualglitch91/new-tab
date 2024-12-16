import { Fragment, useEffect, useState } from "react";
import { Divider, List, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Timer } from "$app/types/hass-scheduler";
import api from "$app/utils/api";
import clock from "$app/utils/clock";
import {
  humanizeDuration,
  formatSecondsToMinutesAndSeconds,
} from "$app/utils/dateTime";
import useMountEffect from "$app/utils/useMountEffect";
import { queryClient } from "$app/utils/queryClient";
import useConfirm from "$app/utils/useConfirm";
import EmptyState from "../EmptyState";
import AltIconButton from "../AltIconButton";
import ListItem from "../ListItem";
import GlossyPaper from "../GlossyPaper";

function TimerItem({
  timer,
  onDone,
  onDelete,
}: {
  timer: Timer;
  onDone: () => void;
  onDelete: () => void;
}) {
  const getRemaining = () =>
    timer.duration - (Date.now() - timer.startedAt) / 1000;

  const [remaining, setRemaining] = useState(getRemaining);

  useMountEffect(() => {
    return clock.on(() => setRemaining(getRemaining));
  });

  useEffect(() => {
    if (remaining === 0) {
      setTimeout(onDone, 1000);
    }
    //eslint-disable-next-line
  }, [remaining]);

  return (
    <ListItem
      primaryText={timer.name}
      endSlot={
        <Stack direction="row" gap="6px" alignItems="center">
          {remaining >= 3600
            ? humanizeDuration(remaining * 1000, {
                largest: 2,
                units: ["d", "h", "m"],
              })
            : formatSecondsToMinutesAndSeconds(remaining)}
          <AltIconButton size={28} icon="close" onClick={onDelete} />
        </Stack>
      }
    />
  );
}

export default function Timers() {
  const {
    data = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["timers"],
    queryFn: () => api<Timer[]>("/timers", "get"),
  });

  const confirm = useConfirm();

  const onDelete = (item: Timer) => {
    confirm({
      title: "Deletar Timer",
      confirmLabel: "Deletar",
      onConfirm: () => {
        queryClient.setQueryData<Timer[]>(["timers"], (prev) => {
          return (prev || []).filter((it) => it.id !== item.id);
        });

        api(`/timers/${item.id}`, "delete").then(() => refetch());
      },
    });
  };

  return (
    <List component={GlossyPaper}>
      {data.length === 0 ? (
        <EmptyState loading={isLoading} text="Nenhum timer criado" />
      ) : (
        data.map((it, index) => (
          <Fragment key={it.id}>
            <TimerItem
              timer={it}
              onDone={refetch}
              onDelete={() => onDelete(it)}
            />
            {index < data.length - 1 && <Divider sx={{ my: 0.5 }} />}
          </Fragment>
        ))
      )}
    </List>
  );
}
