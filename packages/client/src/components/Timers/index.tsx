import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Actions, Timer } from "@home-control/types/hass-scheduler";
import api from "../../utils/api";
import clock from "../../utils/clock";
import useMountEffect from "../../utils/useMountEffect";
import useModal from "../../utils/useModal";
import PillButton from "../PillButton";
import ListItem from "../ListItem";
import NewTimerDialog from "./NewTimerDialog";
import { formatSecondsToMinutesAndSeconds } from "../../utils/dateTime";
import FlexRow from "../FlexRow";
import { queryClient } from "../../utils/queryClient";
import { useResponsive } from "../../utils/general";
import EmptyState from "../EmptyState";
import ResponsiveCard from "../ResponsiveCard";

function TimerItem({
  timer,
  onDone,
  onDelete,
}: {
  timer: Timer;
  onDone: () => void;
  onDelete: () => void;
}) {
  const { isMobile } = useResponsive();

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

  const deleteButton = <PillButton icon="close" onClick={onDelete} />;

  return (
    <ListItem
      label={
        <FlexRow>
          {!isMobile && deleteButton}
          {timer.name}
        </FlexRow>
      }
    >
      <FlexRow>
        {formatSecondsToMinutesAndSeconds(remaining)}
        {isMobile && deleteButton}
      </FlexRow>
    </ListItem>
  );
}

export default function Timers() {
  const [mount, modals] = useModal();
  const {
    data = [],
    refetch,
    isInitialLoading,
  } = useQuery(["timers"], () => api<Timer[]>("/hass-scheduler/timers", "get"));

  function onSave(unmount: () => void) {
    return function (name: string, duration: number, actions: Actions) {
      unmount();
      api("/hass-scheduler/timers", "post", { name, duration, actions }).then(
        () => refetch()
      );
    };
  }

  function onDelete(item: Timer) {
    queryClient.setQueryData<Timer[]>(["timers"], (prev) => {
      return (prev || []).filter((it) => it.id !== item.id);
    });

    api(`/hass-scheduler/timers/${item.id}`, "delete").then(() => refetch());
  }

  return (
    <>
      {modals}
      <ResponsiveCard
        title="Timers"
        // titleAction={
        //   <PillButton
        //     icon="plus"
        //     onClick={() =>
        //       mount((unmount) => (
        //         <NewTimerDialog
        //           defaultName={`Timer ${data.length + 1}`}
        //           onSave={onSave(unmount)}
        //           onClose={unmount}
        //         />
        //       ))
        //     }
        //   />
        // }
        groups={
          data.length === 0
            ? [
                <EmptyState
                  loading={isInitialLoading}
                  text="Nenhum timer criado"
                />,
              ]
            : data.map((it) => (
                <TimerItem
                  key={it.id}
                  timer={it}
                  onDone={refetch}
                  onDelete={() => onDelete(it)}
                />
              ))
        }
      />
    </>
  );
}
