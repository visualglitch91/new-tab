import { useRef, useState } from "react";
import useMountEffect from "$client/utils/useMountEffect";

export function formatRemaining(remaining: number) {
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

type PomodoroStatus = "focus" | "short-break" | "long-break";

interface State {
  cycleCount: number;
  duration: number;
  prevStatus: PomodoroStatus | null;
  remaining: number;
  running: boolean;
  status: PomodoroStatus;
  connection: "idle" | "connected" | "offline";
}

export default function usePomodoro() {
  const wsRef = useRef<WebSocket | null>(null);

  const [state, setState] = useState<State>({
    cycleCount: 0,
    duration: 0,
    prevStatus: null,
    remaining: 0,
    running: false,
    status: "focus",
    connection: "idle",
  });

  const stateRef = useRef(state);

  const connect = () => {
    if (stateRef.current.connection === "connected") {
      return;
    }

    const onError = () => {
      setState((prev) => ({ ...prev, connection: "offline" }));
      setTimeout(connect, 1000);
    };

    if (!process.env.WEBSOCKET_URL) {
      onError();
      return;
    }

    const ws = (wsRef.current = new WebSocket(process.env.WEBSOCKET_URL));

    ws.addEventListener("message", (e) => {
      const state = JSON.parse(e.data);

      setState((prev) => ({
        ...prev,
        ...state,
        connection: "connected",
      }));
    });

    ws.addEventListener("close", onError);
    ws.addEventListener("error", onError);
  };

  useMountEffect(() => {
    connect();
    window.addEventListener("focus", connect);

    return () => {
      window.removeEventListener("focus", connect);
      wsRef.current?.close();
      wsRef.current = null;
    };
  });

  function toggleRunning() {
    if (state && wsRef.current) {
      wsRef.current?.send(state.running ? "stop" : "start");
    }
  }

  function restart() {
    if (state && wsRef.current) {
      wsRef.current?.send("reset");
    }
  }

  return [state, toggleRunning, restart, connect] as const;
}
