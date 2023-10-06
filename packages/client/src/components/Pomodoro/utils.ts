import { useEffect, useRef, useState } from "react";
import { config } from "../../../../../config";

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
}

export default function usePomodoro() {
  const wsRef = useRef<WebSocket | null>(null);
  const [state, setState] = useState<State>();

  useEffect(() => {
    let retryTimeout = 0;

    const retry = () => {
      retryTimeout = window.setTimeout(connect, 1000);
    };

    const connect = () => {
      const ws = (wsRef.current = new WebSocket(config.pomodoro.websocket));

      ws.addEventListener("message", (e) => {
        const state = JSON.parse(e.data);
        setState(state);
      });

      ws.addEventListener("close", retry);
      ws.addEventListener("error", retry);
    };

    connect();

    return () => {
      wsRef.current?.close();
      wsRef.current = null;
      window.clearTimeout(retryTimeout);
    };
  }, []);

  function toggleRunning() {
    if (state && wsRef.current) {
      wsRef.current?.send(state.running ? "stop" : "start");
    }
  }

  return [state, toggleRunning] as const;
}
