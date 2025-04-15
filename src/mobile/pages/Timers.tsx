import AltIconButton from "$app/components/AltIconButton";
import Timers from "$app/components/Timers";
import useAddTimer from "$app/components/Timers/useAddTimer";
import PageLayout from "$app/mobile/components/PageLayout";
import PageTile from "$app/mobile/components/PageTitle";

export default function TimersPage() {
  const addTimer = useAddTimer();

  return (
    <PageLayout
      header={<PageTile>Timers</PageTile>}
      headerItems={<AltIconButton icon="plus" onClick={addTimer} />}
    >
      <Timers />
    </PageLayout>
  );
}
