import { useQuery } from "@tanstack/react-query";
import { TickTickData } from "@home-control/types/ticktick";
import api from "./api";

export default function useTickTickData() {
  const {
    data = {
      delayed: [],
      today: [],
      tomorrow: [],
      unscheduled: [],
      habits: [],
    },
  } = useQuery(["ticktick"], () => api<TickTickData>("/ticktick/data", "GET"));

  return data;
}
