import AltIconButton from "../../../components/AltIconButton";
import Icon from "../../../components/Icon";
import Timers from "../../../components/Timers";
import useAddTimer from "../../../components/Timers/useAddTimer";
import PageLayout from "../../components/PageLayout";
import PageTile from "../../components/PageTitle";

export default function TimersPage() {
  const [addTimer, modals] = useAddTimer();

  return (
    <PageLayout
      header={<PageTile>Timers</PageTile>}
      headerItems={
        <AltIconButton onClick={addTimer}>
          <Icon icon="plus" size={20} />
        </AltIconButton>
      }
    >
      {modals}
      <Timers />
    </PageLayout>
  );
}
