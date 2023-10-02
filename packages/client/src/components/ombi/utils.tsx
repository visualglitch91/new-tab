import { RGB } from "../../utils/general";

export const STATUS_COLORS = {
  available: [56, 142, 60],
  partially: [0, 151, 167],
  approved: [2, 119, 189],
  denied: [198, 40, 40],
  pending: [255, 143, 0],
} as Record<string, RGB>;

export const STATUS_LABELS = {
  available: "Disponível",
  partially: "Parcial",
  approved: "Aprovado",
  denied: "Negado",
  pending: "Pendente",
};

export const TYPE_LABEL = {
  tv: "Série",
  movie: "Filme",
};
