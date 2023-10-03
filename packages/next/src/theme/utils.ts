import { Components, Theme } from "@mui/material";

export type ComponentOverride = Components<Omit<Theme, "components">>;
