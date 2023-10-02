import { ButtonGroup, styled } from "@mui/joy";
import { Schedule } from "@home-control/types/hass-scheduler";
import { alpha } from "../../utils/styles";
import DaysRow from "./DaysRow";
import PillButton from "../PillButton";
import FlexRow from "../FlexRow";
import { useResponsive } from "../../utils/general";
import { useMenu } from "../../utils/useMenu";
import { formatTime } from "./utils";

const Root = styled("div")(({ theme }) => ({
  padding: 16,
  width: "100%",
  boxSizing: "border-box",
  fontSize: 14,
  borderTop: `1px solid ${alpha(theme.palette.primary[400], 0.3)}`,
  "&:hover": { backgroundColor: alpha(theme.palette.neutral[800], 0.3) },
}));

const Time = styled("div")({
  fontWeight: "bold",
  marginLeft: "auto",
});

const Days = styled("div")({
  marginTop: 8,
  display: "flex",
  justifyContent: "center",
  "& .MuiToggleButtonGroup-root": {
    width: "100%",
  },
});

export default function ScheduleItem({
  schedule,
  onPatch,
  onEdit,
  onDelete,
}: {
  schedule: Schedule;
  onPatch: <K extends keyof Schedule>(key: K, value: Schedule[K]) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { isMobile } = useResponsive();
  const [showMenu, menu] = useMenu();

  const options = [
    {
      label: schedule.enabled ? "Desativar" : "Ativar",
      primary: !schedule.enabled,
      value: "toggle",
      icon: schedule.enabled
        ? "mdi:checkbox-marked-circle-outline"
        : "checkbox-blank-circle-outline",
      action: () => onPatch("enabled", !schedule.enabled),
    },
    {
      label: "Editar",
      value: "edit",
      icon: "pencil-outline",
      action: onEdit,
    },
    {
      label: "Deletar",
      value: "delete",
      icon: "close",
      action: onDelete,
    },
  ];

  return (
    <>
      {menu}
      <Root>
        <FlexRow>
          {!isMobile && (
            <ButtonGroup
              sx={{
                "--ButtonGroup-separatorColor": "transparent",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              {options.map((it, index) => (
                <PillButton key={index} icon={it.icon} onClick={it.action} />
              ))}
            </ButtonGroup>
          )}
          <span
            style={{
              textDecoration: schedule.enabled ? "unset" : "line-through",
            }}
          >
            {schedule.name}
          </span>
          <Time>
            <FlexRow>
              {formatTime(schedule.time)}
              {isMobile && (
                <PillButton
                  icon="dots-vertical"
                  onClick={() =>
                    showMenu({
                      title: "Opções",
                      options: options,
                      onSelect: (value) => {
                        options.find((it) => it.value === value)?.action();
                      },
                    })
                  }
                />
              )}
            </FlexRow>
          </Time>
        </FlexRow>
        <Days>
          <DaysRow
            buttonFlex={1}
            value={schedule.days}
            onChange={(value) => onPatch("days", value)}
          />
        </Days>
      </Root>
    </>
  );
}
