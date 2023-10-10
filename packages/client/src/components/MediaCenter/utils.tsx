import { Colors } from "../DraculaChip";

export const STATUS_COLORS = {
  available: Colors.Green,
  partially: Colors.Cyan,
  monitored: Colors.Pink,
  "not-monitored": Colors.Red,
} as Record<string, Colors>;

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
