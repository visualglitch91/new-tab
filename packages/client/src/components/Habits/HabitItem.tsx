import { ButtonBase, styled } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Habit } from "@home-control/types/ticktick";
import api from "../../utils/api";
import useConfirm from "../../utils/useConfirm";
import DraculaChip, { Colors } from "../DraculaChip";
import { queryClient } from "../../utils/queryClient";
import DotLoading from "../DotLoading";

const colors = {
  zeroed: Colors.Red,
  partial: Colors.Yellow,
  done: Colors.Green,
};

const Root = styled(ButtonBase)({
  gap: "8px",
  textAlign: "left",
  justifyContent: "space-between",
  background: "rgba(10,10,10,0.3)",
  borderRadius: 12,
  padding: "12px 16px",
  whiteSpace: "nowrap",
  "&:hover": { background: "rgba(0,0,0,0.35)" },
});

export default function HabitItem({ item }: { item: Habit }) {
  const confirm = useConfirm();
  const { mutate, isLoading } = useMutation(() => {
    return api("/ticktick/habits/checkin", "POST", {
      habitId: item.habitId,
    }).then(() => queryClient.invalidateQueries(["ticktick"]));
  });

  const stauts =
    item.value >= item.goal ? "done" : item.value === 0 ? "zeroed" : "partial";

  return (
    <Root
      key={item.habitId}
      className="HabitItem-root"
      onClick={() => {
        confirm({
          title: "Marcar hábito?",
          onConfirm: () => mutate(),
        });
      }}
    >
      {item.name}
      {isLoading ? (
        <DotLoading sx={{ "--size": "8px" }} />
      ) : (
        <DraculaChip
          sx={{ fontWeight: 600 }}
          color={colors[stauts]}
          text={`${item.value}/${item.goal}`}
        />
      )}
    </Root>
  );
}
