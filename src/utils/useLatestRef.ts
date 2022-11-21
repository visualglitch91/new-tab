import { useEffect, useRef } from "react";

export default function useLatestRef<T>(callback: T) {
  const ref = useRef(callback);

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  return ref;
}
