import { Chip, Stack, styled } from "@mui/material";
import HomeDevices from "$app/components/HomeDevices";
import PageLayout from "$app/mobile/components/PageLayout";
import PageTile from "$app/mobile/components/PageTitle";

const HeaderPills = styled("div")({
  overflow: "auto",
  marginLeft: -16,
  padding: "0 16px",
  width: "100vw",
  transition: "margin 200ms var(--tween)",
  '[data-shrink="true"] &': { marginTop: 8 },
  display: "flex",
  gap: 8,
  alignItems: "center",
  "-ms-overflow-style": "none" /* Internet Explorer 10+ */,
  "scrollbar-width": "none" /* Firefox */,
  "&::-webkit-scrollbar": {
    display: "none" /* Safari and Chrome */,
  },
});

export default function Devices() {
  return (
    <PageLayout
      header={
        <Stack>
          <PageTile>Casa</PageTile>
          <HeaderPills data-ignore-swipe="true">
            {[
              "Casa",
              "Sala",
              "Cozinha e Lavanderia",
              "Quarto",
              "Banheiro",
              "Oficina",
              "Outros",
            ].map((value, index) => (
              <Chip
                clickable
                key={value}
                label={value}
                onClick={() => {
                  const target = document.querySelector<HTMLElement>(
                    `[title="${value}"]`
                  );

                  if (!target) {
                    return;
                  }

                  document.documentElement.scrollTo({
                    top: index === 0 ? 0 : target.offsetTop - 116,
                    behavior: "smooth",
                  });
                }}
              />
            ))}
          </HeaderPills>
        </Stack>
      }
    >
      <Stack spacing={5}>
        <HomeDevices hideFirstGroupTitle />
      </Stack>
    </PageLayout>
  );
}
