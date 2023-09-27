import { useState } from "react";
import useMountEffect from "../../utils/useMountEffect";
import { getAccessToken } from "../../utils/hass";
import { ParsedApp } from "./utils";
import DialogBase from "../DialogBase";
import useShellOutput from "../ShellOutput";

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

export default function LogDialog({
  app,
  onClose,
}: {
  app: ParsedApp;
  onClose: () => void;
}) {
  const [controller] = useState(() => new AbortController());

  const { element, write } = useShellOutput({
    sx: (theme) => ({
      [theme.breakpoints.up("sm")]: { borderRadius: "12px" },
    }),
  });

  useMountEffect(() => {
    fetch(`/api/app-manager/${app.type}/${app.rawName}/logs`, {
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

    const abort = () => {
      console.log("abort");
      controller.abort();
    };

    window.addEventListener("beforeunload", abort);

    return () => {
      abort();
      window.removeEventListener("beforeunload", abort);
    };
  });

  return (
    <DialogBase
      sx={{
        width: "100vw",
        height: "100vh",
        maxWidth: "unset",
        maxHeight: "unset",
        borderRadius: 0,
      }}
      contentSx={(theme) => ({
        height: "100%",
        [theme.breakpoints.down("sm")]: {
          px: 0,
          pb: 0,
        },
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      })}
      title="Logs"
      closeButtonOnMobile
      onClose={onClose}
    >
      {element}
    </DialogBase>
  );
}
