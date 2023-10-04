import { RGB } from "../../utils/colors";

export const STATUS_COLORS = {
  available: [56, 142, 60],
  partially: [0, 151, 167],
  monitored: [2, 119, 189],
  "not-monitored": [198, 40, 40],
} as Record<string, RGB>;

export const STATUS_LABELS = {
  available: "Disponível",
  partially: "Parcial",
  monitored: "Pendente",
  "not-monitored": "Não Requisitado",
};

export const TYPE_LABEL = {
  tv: "Série",
  movie: "Filme",
};
