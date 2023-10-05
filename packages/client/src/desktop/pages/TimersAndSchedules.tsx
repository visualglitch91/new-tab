import { Grid } from "@mui/material";
import Timers from "../../components/Timers";
import Schedules from "../../components/Schedules";
import Section from "../../components/Section";
import useUpsertSchedule from "../../components/Schedules/useUpsertSchedule";
import useAddTimer from "../../components/Timers/useAddTimer";
import AltIconButton from "../../components/AltIconButton";
import Icon from "../../components/Icon";

export default function TimersAndSchedulesPage() {
  const addTimer = useAddTimer();
  const upsertSchedule = useUpsertSchedule();

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} lg={6} xl={4}>
        <Section
          title="Timers"
          button={
            <AltIconButton onClick={addTimer}>
              <Icon icon="plus" size={20} />
            </AltIconButton>
          }
        >
          <Timers />
        </Section>
      </Grid>
      <Grid item xs={12} lg={6} xl={5}>
        <Section
          title="Agendamentos"
          button={
            <AltIconButton onClick={() => upsertSchedule()}>
              <Icon icon="plus" size={20} />
            </AltIconButton>
          }
        >
          <Schedules />
        </Section>
      </Grid>
    </Grid>
  );
}
