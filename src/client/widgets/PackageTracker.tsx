import { styled } from "@mui/joy";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useConfirm } from "../utils/useConfirm";
import { usePrompt } from "../utils/usePrompt";
import { alpha } from "../utils/styles";
import api from "../utils/api";
import PillButton from "../components/PillButton";
import { PackageTrackerItem } from "../../types/package-tracker";
import ListCard from "../components/ListCard";
import RippleButton from "../components/RippleButton";

const ItemCard = styled(RippleButton)(({ theme }) => ({
  padding: 16,
  width: "100%",
  justifyContent: "stretch",
  textAlign: "left",
  background: "transparent",
  border: "none",
  borderTop: `1px solid ${alpha(theme.palette.primary[400], 0.3)}`,
  "&:hover": { backgroundColor: alpha(theme.palette.neutral[800], 0.3) },
}));

const ItemContent = styled("div")({
  display: "grid",
  gridTemplateAreas: `
    "label date"
    "description description"
    "location location"
  `,
  gridTemplateColumns: "auto min-content",
  rowGap: "4px",
  width: "100%",
});

const Label = styled("span")({
  gridArea: "label",
  fontSize: "14px",
  fontWeight: "bold",
});

const At = styled("span")({
  gridArea: "date",
  whiteSpace: "nowrap",
  fontSize: "12px",
  fontWeight: "bold",
});

const Desciption = styled("span")({
  gridArea: "description",
  opacity: 0.8,
  fontSize: "12px",
  fontWeight: "bold",
  whiteSpace: "pre-wrap",
});

function parseDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    month: "short",
    day: "numeric",
  });
}

export default function PackageTracker() {
  const { data: packages = [], refetch } = useQuery(["packages"], () =>
    api<PackageTrackerItem[]>("/package-tracker/list", "get")
  );

  const { mutate } = useMutation(
    ({
      action,
      ...body
    }:
      | { action: "add"; name: string; code: string }
      | { action: "remove"; code: string }) => {
      return api(`/package-tracker/${action}`, "post", body).then(() =>
        refetch()
      );
    }
  );

  const [prompt, $prompt] = usePrompt();
  const [confirm, $confirm] = useConfirm();

  function add() {
    prompt({
      title: "Adicionar",
      fields: ["Nome", "Código"],
      onConfirm: (values) => {
        if (values[0] && values[1]) {
          mutate({ action: "add", name: values[0], code: values[1] });
        }
      },
    });
  }

  function remove(item: PackageTrackerItem) {
    confirm({
      title: `Remover "${item.name}"`,
      onConfirm: () => {
        mutate({ action: "remove", code: item.code });
      },
    });
  }

  return (
    <ListCard
      gap={0}
      title="Encomendas"
      titleAction={<PillButton icon="mdi:plus" onClick={add} />}
    >
      {$prompt}
      {$confirm}
      {packages?.map((it) => (
        <ItemCard key={it.code} onLongPress={() => remove(it)}>
          <ItemContent>
            <Label>
              {it.name} ({it.code})
            </Label>
            {it.lastEvent ? (
              <>
                {it.lastEvent.at && <At>{parseDate(it.lastEvent.at)}</At>}
                <Desciption>
                  {it.lastEvent.description}

                  {it.lastEvent.location && (
                    <>
                      <br />
                      {it.lastEvent.location}
                    </>
                  )}
                </Desciption>
              </>
            ) : (
              <Desciption>Não Encontrado</Desciption>
            )}
          </ItemContent>
        </ItemCard>
      ))}
    </ListCard>
  );
}
