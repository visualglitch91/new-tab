import { useEffect, useState } from "react";

export default function useAsyncChange({
  flag,
  timeout,
}: {
  flag: boolean;
  timeout: number;
}) {
  const [changingTo, setChangingTo] = useState<boolean | undefined>(undefined);
  const changing = typeof changingTo !== "undefined";

  function change() {
    if (timeout < 1) {
      return true;
    }

    if (changing) {
      return false;
    }

    const next = !flag;

    setChangingTo(next);

    return true;
  }

  useEffect(() => {
    if (flag === changingTo) {
      setChangingTo(undefined);
    }
  }, [flag, changingTo]);

  useEffect(() => {
    if (typeof changingTo === "boolean") {
      const ref = window.setTimeout(() => setChangingTo(undefined), timeout);
      return () => clearTimeout(ref);
    }
  }, [timeout, changingTo]);

  return { changing, changingTo, change };
}
