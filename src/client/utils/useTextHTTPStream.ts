import { useEffect, useRef, useState } from "react";
import useShellOutput from "../components/ShellOutput";
import useMountEffect from "./useMountEffect";
import { getAccessToken } from "./hass";

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

export default function useTextHTTPStream(path?: string) {
  const controllerRef = useRef<AbortController>();

  const { element, write } = useShellOutput({
    sx: (theme) => ({
      [theme.breakpoints.up("sm")]: { borderRadius: "12px" },
    }),
  });

  function abort() {
    controllerRef.current?.abort();
  }

  useEffect(() => {
    if (!path) {
      return;
    }

    const controller = new AbortController();

    controllerRef.current = controller;

    fetch(`/api${path}`, {
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })
      .then(async (response: Response) => {
        const reader = response.body?.getReader();

        if (!reader) {
          throw new Error();
        }

        for await (const line of readLines(reader)) {
          write(line);
        }
      })
      .catch(() => {});

    window.addEventListener("beforeunload", abort);

    return () => {
      abort();
      window.removeEventListener("beforeunload", abort);
    };

    //eslint-disable-next-line
  }, [path]);

  return { shellOutput: element, abort };
}
