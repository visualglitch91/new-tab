import { useState } from "react";
import GlossyPaper from "./GlossyPaper";
import useMountEffect from "../utils/useMountEffect";
import clock from "../utils/clock";
import { SxProps } from "../theme/utils";
import { sxx } from "../utils/styling";

function getTime() {
  const now = new Date();
  const hours = ("0" + now.getHours()).slice(-2);
  const minutes = ("0" + now.getMinutes()).slice(-2);

  return `${hours}:${minutes}`;
}

export default function Clock({ sx }: { sx: SxProps }) {
  const [time, setTime] = useState(getTime);

  useMountEffect(() => {
    return clock.on(() => setTime(getTime()));
  });

  return (
    <GlossyPaper
      sx={sxx(
        {
          textAlign: "center",
          fontSize: "86px",
          padding: "12px 0 24px",
        },
        sx
      )}
    >
      {time}
    </GlossyPaper>
  );
}
