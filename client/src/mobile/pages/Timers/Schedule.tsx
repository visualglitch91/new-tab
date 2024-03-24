import AltIconButton from "$client/components/AltIconButton";
import Icon from "$client/components/Icon";
import Schedules from "$client/components/Schedules";
import useUpsertSchedule from "$client/components/Schedules/useUpsertSchedule";
import PageLayout from "$client/mobile/components/PageLayout";
import PageTile from "$client/mobile/components/PageTitle";

export default function SchedulePage() {
  const upsertSchedule = useUpsertSchedule();

  return (
    <PageLayout
      header={<PageTile>Agendamentos</PageTile>}
      headerItems={
        <AltIconButton onClick={() => upsertSchedule()}>
          <Icon icon="plus" size={20} />
        </AltIconButton>
      }
    >
      <Schedules />
    </PageLayout>
  );
}
