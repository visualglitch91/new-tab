import { useRef, useState } from "react";
import { styled } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
//@ts-expect-error
import ShellColor from "shell-color";
import useMountEffect from "../utils/useMountEffect";

const shellColorConfig = {
  colorMap: {
    black: "#14151a",
    blue: "#BD93F9",
    cyan: "#8BE9FD",
    green: "#50FA7B",
    purple: "#FF79C6",
    red: "#FF5555",
    white: "#F8F8F2",
    yellow: "#F1FA8C",
    brightBlack: "#6272A4",
    brightBlue: "#D6ACFF",
    brightCyan: "#A4FFFF",
    brightGreen: "#69FF94",
    brightPurple: "#FF92DF",
    brightRed: "#FF6E6E",
    brightWhite: "#FFFFFF",
    brightYellow: "#FFFFA5",
  },
  defaultBackgroundColor: "black" as const,
  defaultForegroundColor: "white" as const,
  snippetTag: "p",
};

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

export default function useShellOutput({ sx }: { sx: SxProps }) {
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
