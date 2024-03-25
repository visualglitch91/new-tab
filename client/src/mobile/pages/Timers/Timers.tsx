import AltIconButton from "$client/components/AltIconButton";
import Timers from "$client/components/Timers";
import useAddTimer from "$client/components/Timers/useAddTimer";
import PageLayout from "$client/mobile/components/PageLayout";
import PageTile from "$client/mobile/components/PageTitle";

export default function TimersPage() {
  const addTimer = useAddTimer();

  return (
    <PageLayout
      header={<PageTile>Timers</PageTile>}
      headerItems={
        <AltIconButton icon="plus" onClick={addTimer}/>
      }
    >
      <Timers />
    </PageLayout>
  );
}
