import { useEffect, useRef, useState } from "react";
import useShellOutput from "../components/ShellOutput";
import useMountEffect from "./useMountEffect";
import { getAccessToken } from "./hass";
import { useSocketIO } from "./api";

function readChunks(reader: ReadableStreamDefaultReader<Uint8Array>) {
  return {
    async *[Symbol.asyncIterator]() {
      let readResult = await reader.read();

      while (!readResult.done) {
        yield readResult.value;
        readResult = await reader.read();
      }
    },
  };
}

async function* readLines(reader: ReadableStreamDefaultReader<Uint8Array>) {
  const textDecoder = new TextDecoder();
  let partOfLine = "";

  for await (const chunk of readChunks(reader)) {
    const chunkText = textDecoder.decode(chunk);
    const chunkLines = chunkText.split("\n");

    if (chunkLines.length === 1) {
      partOfLine += chunkLines[0];
    } else if (chunkLines.length > 1) {
      yield partOfLine + chunkLines[0];

      for (let i = 1; i < chunkLines.length - 1; i++) {
        yield chunkLines[i];
      }

      partOfLine = chunkLines[chunkLines.length - 1];
    }
  }
}

export default function useProcessRunner(processId?: string) {
  const socket = useSocketIO();

  const { element, write } = useShellOutput({
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
