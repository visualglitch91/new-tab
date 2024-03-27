import { Box } from "@mui/material";
import Grid2, { type Grid2Props } from "@mui/material/Unstable_Grid2";

export type GridProps<
  D extends React.ElementType = "div",
  P = { component?: D }
> = Omit<Grid2Props<D, P>, "container"> & React.ComponentProps<D>;
export type GridItemProps = Omit<Grid2Props, "container">;

export function Grid<
  D extends React.ElementType = "div",
  P = { component?: React.ElementType }
>({ spacing, gap, ...props }: GridProps<D, P>) {
  return (
    // Wrap it in a div so parent components don't mess with the Grid container's margin
    <Box width="100%">
      <Grid2 {...props} spacing={spacing || gap} container />
    </Box>
  );
}

export const GridItem = Grid2 as React.ElementType<GridItemProps>;
