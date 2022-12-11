import { css, styled } from "../styling";
import { callService } from "../utils/hass";
import { usePackages } from "../utils/packages";
import { Package } from "../utils/typings";
import { useConfirm } from "../utils/useConfirm";
import { usePrompt } from "../utils/usePrompt";
import ButtonCard from "../components/ButtonCard";
import PillButton from "../components/PillButton";
import Stack from "../components/Stack";
import TitleCard from "../components/TitleCard";

const ItemCard = styled(
  ButtonCard,
  css`
    padding: 12px;
    justify-content: stretch;
    text-align: left;
  `
);

const ItemContent = styled(
  "div",
  css`
    display: grid;
    grid-template-areas:
      "label date"
      "description description"
      "location location";
    grid-template-columns: auto min-content;
    row-gap: 4px;
    width: 100%;
  `
);

const Label = styled(
  "span",
  css`
    grid-area: label;
    font-size 14px;
    font-weight: bold;
  `
);

const At = styled(
  "span",
  css`
    grid-area: date;
    white-space: nowrap;
    font-size 12px;
    font-weight: bold;
  `
);

const Desciption = styled(
  "span",
  css`
    grid-area: description;
    opacity: 0.8;
    font-size 12px;
    font-weight: bold;
  `
);

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
          callService("shell_command", "correios_add", {
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
        callService("shell_command", "correios_remove", {
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
        <ItemCard key={it.code} onPress={() => remove(it)}>
          <ItemContent>
            <Label>{it.name}</Label>
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
