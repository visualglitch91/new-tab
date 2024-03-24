import { useEffect, useState } from "react";
import { List, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Timer } from "$common/types/hass-scheduler";
import api from "$client/utils/api";
import clock from "$client/utils/clock";
import {
  humanizeDuration,
  formatSecondsToMinutesAndSeconds,
} from "$client/utils/dateTime";
import useMountEffect from "$client/utils/useMountEffect";
import { queryClient } from "$client/utils/queryClient";
import EmptyState from "../EmptyState";
import AltIconButton from "../AltIconButton";
import ListItem from "../ListItem";
import Icon from "../Icon";
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
          <AltIconButton sx={{ "--size": "28px" }} onClick={onDelete}>
            <Icon size={16} icon="close" />
          </AltIconButton>
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
    queryFn: () => api<Timer[]>("/hass-scheduler/timers", "get"),
  });

  function onDelete(item: Timer) {
    queryClient.setQueryData<Timer[]>(["timers"], (prev) => {
      return (prev || []).filter((it) => it.id !== item.id);
    });

    api(`/hass-scheduler/timers/${item.id}`, "delete").then(() => refetch());
  }

  return (
    <List component={GlossyPaper}>
      {data.length === 0 ? (
        <EmptyState loading={isLoading} text="Nenhum timer criado" />
      ) : (
        data.map((it) => (
          <TimerItem
            key={it.id}
            timer={it}
            onDone={refetch}
            onDelete={() => onDelete(it)}
          />
        ))
      )}
    </List>
  );
}
