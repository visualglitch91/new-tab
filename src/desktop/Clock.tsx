import { useState } from "react";
import useMountEffect from "$app/utils/useMountEffect";
import clock from "$app/utils/clock";
import Icon from "$app/components/Icon";
import Flex from "../components/Flex";

function getTime() {
  const now = new Date();
  const hours = ("0" + now.getHours()).slice(-2);
  const minutes = ("0" + now.getMinutes()).slice(-2);

  return `${hours}:${minutes}`;
}

export default function Clock() {
  const [time, setTime] = useState(getTime);

  useMountEffect(() => {
    return clock.on(() => setTime(getTime()));
  });

  return (
    <Flex align="center" gap={0.5}>
      <Icon icon="clock-outline" color="red" size={16} />
      {time}
    </Flex>
  );
}
