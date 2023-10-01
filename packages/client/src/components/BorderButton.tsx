import { type Theme } from "@mui/joy/styles";
import Button from "./Button";
import { sxx } from "../utils/styles";

type BorderButtonProps = React.ComponentProps<typeof Button> & {
  primary?: boolean;
};

function style(props: BorderButtonProps) {
  return (theme: Theme) => ({
    border: `1px solid ${theme.palette.primary[400]}`,
    ...(props.primary
      ? {
          background: theme.palette.primary[400],
          color: "white",

          "&:hover": {
            background: theme.palette.primary.darkChannel,
            borderColor: theme.palette.primary.darkChannel,
          },
        }
      : {}),
    "&:disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  });
}

export default function BorderButton({ sx, ...props }: BorderButtonProps) {
  return <Button {...props} sx={sxx(style(props), sx)} />;
}
