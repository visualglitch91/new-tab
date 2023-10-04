import { useRef, useState, useEffect } from "react";
import { styled } from "@mui/material";
//@ts-expect-error
import ShellColor from "shell-color";
import useMountEffect from "../../utils/useMountEffect";
import { useSocketIO } from "../../utils/api";
import { shellColorConfig } from "./utils";
import { SxProps } from "../../theme/utils";

const Root = styled("div")({
  flex: 1,
  overflow: "auto",
  padding: "16px",
  background:
    shellColorConfig.colorMap[shellColorConfig.defaultBackgroundColor],
});

const Output = styled("div")({
  fontSize: 14,
  fontFamily: "monospace",
  whiteSpace: "nowrap",
  "& p": { margin: "2px 0" },
});

function useShellColorsWrapper({ sx }: { sx: SxProps }) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [sc] = useState(() => new ShellColor(shellColorConfig));

  useMountEffect(() => {
    sc.on("snippet", (tag: HTMLParagraphElement) => {
      const node = nodeRef.current;

      if (node && node.parentElement) {
        node.appendChild(tag);
        node.parentElement.scrollTop = node.parentElement.scrollHeight;
      }
    });

    return () => {
      sc.removeAllListeners();
    };
  });

  const write = sc.write.bind(sc);

  const element = (
    <Root sx={sx}>
      <Output ref={nodeRef} />
    </Root>
  );

  return { write, element };
}

export default function useShellOutput(processId?: string) {
  const socket = useSocketIO();

  const { element, write } = useShellColorsWrapper({
    sx: (theme) => ({
      [theme.breakpoints.up("sm")]: { borderRadius: "12px" },
    }),
  });

  function abort() {
    socket.emit(`process-output:kill:${processId}`);
  }

  useEffect(() => {
    if (!processId) {
      return;
    }

    const key = `process-output:log:${processId}`;
    const onLine = (line: string) => write(line);

    socket.on(key, onLine);
    window.addEventListener("beforeunload", abort);

    return () => {
      abort();
      socket.off(key, onLine);
      window.removeEventListener("beforeunload", abort);
    };

    //eslint-disable-next-line
  }, [processId]);

  return { shellOutput: element, abort };
}
