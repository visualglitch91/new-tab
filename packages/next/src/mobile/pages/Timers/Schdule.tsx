import AltIconButton from "../../../components/AltIconButton";
import Icon from "../../../components/Icon";
import Schedules from "../../../components/Schedules";
import useUpsertSchedule from "../../../components/Schedules/useUpsertSchedule";
import PageLayout from "../../components/PageLayout";
import PageTile from "../../components/PageTitle";

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
