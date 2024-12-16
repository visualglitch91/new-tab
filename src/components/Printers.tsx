import { Fragment } from "react";
import { Divider, List } from "@mui/material";
import GlossyPaper from "./GlossyPaper";
import { EntityListItems } from "./EntityListItem";

const groups = [
  [
    {
      entityId: "switch.impressora_s1_servidor",
      label: "Creality Ender-3 S1",
      confirmBefore: true,
      onClick: () =>
        window.open("https://printers.crisalida.cc?initial=creality-ender3-s1"),
    },
    {
      entityId: "input_boolean.impressora_s1_desligamento_automatico",
      label: "Desligamento Automático",
    },
  ],
  [
    {
      entityId: "switch.impressora_k1_servidor",
      label: "Creality K1",
      confirmBefore: true,
      onClick: () =>
        window.open("https://printers.crisalida.cc?initial=creality-k1"),
    },
    {
      entityId: "input_boolean.impressora_k1_desligamento_automatico",
      label: "Desligamento Automático",
    },
  ],
];

export default function Printers() {
  return (
    <List component={GlossyPaper}>
      {groups.map((it, index) => (
        <Fragment key={index}>
          <EntityListItems items={it} />
          {index < groups.length - 1 && <Divider />}
        </Fragment>
      ))}
    </List>
  );
}
