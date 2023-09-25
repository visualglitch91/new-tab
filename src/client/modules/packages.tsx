import { styled } from "@mui/joy";
import { callService } from "../utils/hass";
import { usePackages } from "../utils/packages";
import { Package } from "../utils/typings";
import { useConfirm } from "../utils/useConfirm";
import { usePrompt } from "../utils/usePrompt";
import ButtonCard from "../components/ButtonCard";
import PillButton from "../components/PillButton";
import Stack from "../components/Stack";
import TitleCard from "../components/TitleCard";

const ItemCard = styled(ButtonCard)({
  padding: "12px",
  justifyContent: "stretch",
  textAlign: "left",
});

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
});

function parseDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    month: "short",
    day: "numeric",
  });
}

function Packages() {
  const { packages, refresh } = usePackages();
  const [prompt, $prompt] = usePrompt();
  const [confirm, $confirm] = useConfirm();

  function add() {
    prompt({
      title: "Adicionar",
      fields: ["Nome", "Código"],
      onConfirm: (values) => {
        if (values[0] && values[1]) {
          callService("rest_command", "correios_add", {
            name: values[0],
            code: values[1],
          }).then(() => refresh());
        }
      },
    });
  }

  function remove(item: Package) {
    confirm({
      title: `Remover "${item.name}"`,
      onConfirm: () => {
        callService("rest_command", "correios_remove", {
          code: item.code,
        }).then(() => refresh());
      },
    });
  }

  return (
    <Stack>
      {$prompt}
      {$confirm}
      <TitleCard
        title="Encomendas"
        action={<PillButton icon="mdi:plus" label="Adicionar" onClick={add} />}
      />
      {packages?.map((it) => (
        <ItemCard key={it.code} onLongPress={() => remove(it)}>
          <ItemContent>
            <Label>
              {it.name} ({it.code})
            </Label>
            {it.lastEvent ? (
              <>
                <At>{parseDate(it.lastEvent.at)}</At>
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
    </Stack>
  );
}

const packagesModule = <Packages />;

export default packagesModule;
