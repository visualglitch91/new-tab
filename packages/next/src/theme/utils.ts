import { Components, Theme, SxProps as MuiSxProps } from "@mui/material";

export type ComponentOverride = Components<Omit<Theme, "components">>;

export type SxProps = MuiSxProps<Theme>;
