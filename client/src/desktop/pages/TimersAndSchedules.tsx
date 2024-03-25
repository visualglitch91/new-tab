import { Grid } from "@mui/material";
import Timers from "$client/components/Timers";
import Schedules from "$client/components/Schedules";
import Section from "$client/components/Section";
import useUpsertSchedule from "$client/components/Schedules/useUpsertSchedule";
import useAddTimer from "$client/components/Timers/useAddTimer";
import AltIconButton from "$client/components/AltIconButton";
import { useIsAdmin } from "$client/utils/hass";

export default function TimersAndSchedulesPage() {
  const isAdmin = useIsAdmin();
  const addTimer = useAddTimer();
  const upsertSchedule = useUpsertSchedule();

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} lg={6} xl={4}>
        <Section
          title="Timers"
          button={<AltIconButton icon="plus" onClick={addTimer} />}
        >
          <Timers />
        </Section>
      </Grid>
      {isAdmin && (
        <Grid item xs={12} lg={6} xl={5}>
          <Section
            title="Agendamentos"
            button={
              <AltIconButton icon="plus" onClick={() => upsertSchedule()} />
            }
          >
            <Schedules />
          </Section>
        </Grid>
      )}
    </Grid>
  );
}
