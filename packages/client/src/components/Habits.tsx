import { Habit } from "@home-control/types/ticktick";
import api from "../utils/api";
import useConfirm from "../utils/useConfirm";
import ListSection from "./ListSection";
import ListItem from "./ListItem";
import useTickTickData from "../utils/useTickTickData";

const colors = {
  zeroed: "#ff5555",
  partial: "#f1fa8c",
  done: "#50fa7b",
};

export default function Habits() {
  const confirm = useConfirm();
  const { data, refetch } = useTickTickData();
  const items = data.habits;

  return (
    <ListSection title="Hábitos">
      {items.map((item) => {
        const stauts =
          item.value >= item.goal
            ? "done"
            : item.value === 0
            ? "zeroed"
            : "partial";

        return (
          <ListItem
            minSize="sm"
            primaryText={item.name}
            endSlot={
              <span
                style={{ color: colors[stauts] }}
              >{`${item.value}/${item.goal}`}</span>
            }
            onClick={() => {
              confirm({
                title: "Marcar hábito?",
                onConfirm: () => {
                  api("/ticktick/habits/checkin", "POST", {
                    habitId: item.habitId,
                  }).then(() => {
                    refetch();
                  });
                },
              });
            }}
          />
        );
      })}
    </ListSection>
  );
}
