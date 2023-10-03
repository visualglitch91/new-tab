import { useEffect, useState } from "react";
import { List, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Timer } from "@home-control/types/hass-scheduler";
import api from "../../utils/api";
import clock from "../../utils/clock";
import { formatSecondsToMinutesAndSeconds } from "../../utils/dateTime";
import useMountEffect from "../../utils/useMountEffect";
import { queryClient } from "../../utils/queryClient";
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
  const [remaining, setRemaining] = useState(() => {
    return timer.duration - (Date.now() - timer.startedAt) / 1000;
  });

  useMountEffect(() => {
    return clock.on(() => {
      setRemaining((prev) => Math.max(prev - 1, 0));
    });
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
        <Stack direction="row" gap="6px">
          {formatSecondsToMinutesAndSeconds(remaining)}
          <AltIconButton onClick={onDelete}>
            <Icon size={18} icon="close" />
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
    isInitialLoading,
  } = useQuery(["timers"], () => api<Timer[]>("/hass-scheduler/timers", "get"));

  function onDelete(item: Timer) {
    queryClient.setQueryData<Timer[]>(["timers"], (prev) => {
      return (prev || []).filter((it) => it.id !== item.id);
    });

    api(`/hass-scheduler/timers/${item.id}`, "delete").then(() => refetch());
  }

  return (
    <List component={GlossyPaper}>
      {data.length === 0 ? (
        <EmptyState loading={isInitialLoading} text="Nenhum timer criado" />
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
