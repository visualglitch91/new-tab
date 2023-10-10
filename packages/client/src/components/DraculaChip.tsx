import { Box } from "@mui/material";
import { SxProps } from "../theme/utils";
import { sxx } from "../utils/styling";

export enum Colors {
  Neutral = "Neutral",
  Comment = "Comment",
  Cyan = "Cyan",
  Green = "Green",
  Orange = "Orange",
  Pink = "Pink",
  Purple = "Purple",
  Red = "Red",
  Yellow = "Yellow",
}

const ColorValues = {
  Neutral: ["#f4f0f0", "#000000"],
  Comment: ["#6272a4", "#FFFFFF"],
  Cyan: ["#8be9fd", "#000000"],
  Green: ["#50fa7b", "#000000"],
  Orange: ["#ffb86c", "#000000"],
  Pink: ["#ff79c6", "#000000"],
  Purple: ["#bd93f9", "#000000"],
  Red: ["#ff5555", "#FFFFFF"],
  Yellow: ["#f1fa8c", "#000000"],
};

export default function DraculaChip({
  sx,
  text,
  color = Colors.Neutral,
}: {
  sx?: SxProps;
  text?: string;
  color?: Colors | keyof typeof ColorValues;
}) {
  return (
    <Box
      component="span"
      className="DraculaChip-root"
      sx={sxx(
        {
          color: ColorValues[color][1],
          backgroundColor: ColorValues[color][0],
          borderRadius: 8,
          padding: "2px 8px",
          fontSize: "0.8em",
          fontWeight: 500,
        },
        sx
      )}
    >
      {text}
    </Box>
  );
}
