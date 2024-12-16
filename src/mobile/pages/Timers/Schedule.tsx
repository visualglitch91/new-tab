import AltIconButton from "$app/components/AltIconButton";
import Schedules from "$app/components/Schedules";
import useUpsertSchedule from "$app/components/Schedules/useUpsertSchedule";
import PageLayout from "$app/mobile/components/PageLayout";
import PageTile from "$app/mobile/components/PageTitle";

export default function SchedulePage() {
  const upsertSchedule = useUpsertSchedule();

  return (
    <PageLayout
      header={<PageTile>Agendamentos</PageTile>}
      headerItems={
        <AltIconButton icon="plus" onClick={() => upsertSchedule()} />
      }
    >
      <Schedules />
    </PageLayout>
  );
}
