import themes from "../themes";
import { changeTheme, colorToHEX, css, currentThemeKey, cx } from "../styling";
import { formatNumericValue, getContrastColor } from "../utils/general";
import ComponentGroup from "../components/ComponentGroup";
import TitleCard from "../components/TitleCard";
import Stack from "../components/Stack";
import Grid from "../components/Grid";
import TouchButton from "../components/TouchButton";
import Icon from "../components/Icon";

const classes = {
  themeButton: css`
    background-size: cover;
    border: none;
    border-radius: 12px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
};

function ThemeButton({ themeKey }: { themeKey: keyof typeof themes }) {
  const color = themes[themeKey].accent;

  return (
    <TouchButton
      className={cx(classes.themeButton)}
      style={{ background: color }}
      onTap={() => changeTheme(themeKey)}
    >
      {themeKey === currentThemeKey && (
        <Icon
          size={24}
          icon="check"
          style={{ color: getContrastColor(colorToHEX(color)) }}
        />
      )}
    </TouchButton>
  );
}

const systemModule = (
  <Stack>
    <ComponentGroup
      title="Sistema"
      layout="list"
      items={[
        {
          icon: "icofont-thermometer",
          label: "Temperatura",
          entityId: "sensor.processor_temperature",
          renderListContent: (entity) => formatNumericValue(entity.state, "°C"),
        },
        {
          label: "Processador",
          entityId: "sensor.processor_use",
          renderListContent: (entity) => formatNumericValue(entity.state, "%"),
        },
        {
          label: "Ventoinha",
          entityId: "sensor.processor_fan_speed",
          renderListContent: (entity) => `${entity.state} RPM`,
        },
        {
          label: "Memória",
          entityId: "sensor.memory_use_percent",
          renderListContent: (entity) => formatNumericValue(entity.state, "%"),
        },
      ]}
    />
    <Stack>
      <TitleCard title="Tema" />
      <Grid gap={8} columnWidth={50} rowHeight={50}>
        {(Object.keys(themes) as (keyof typeof themes)[]).map((themeKey) => (
          <ThemeButton themeKey={themeKey} />
        ))}
      </Grid>
    </Stack>
  </Stack>
);

export default systemModule;
