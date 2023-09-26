import { useEffect, useState } from "react";
import Paper from "../../components/Paper";

function getTime() {
  const now = new Date();
  const hours = ("0" + now.getHours()).slice(-2);
  const minutes = ("0" + now.getMinutes()).slice(-2);

  return `${hours}:${minutes}`;
}

export default function Clock() {
  const [time, setTime] = useState(getTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTime);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Paper
      sx={{
        textAlign: "center",
        fontSize: "86px",
        padding: "12px 0 24px",
      }}
    >
      {time}
    </Paper>
  );
}
