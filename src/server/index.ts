import "dotenv/config";
import path from "path";
import express from "express";
import { createServer } from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { auth } from "./auth";

const host = "0.0.0.0";
const port = Number(process.env.PORT) || 5700;

const app = express();
const server = createServer(app);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api", auth());

const modules = import.meta.glob("./modules/*/index.ts", { eager: true });

for (let key in modules) {
  //@ts-ignore
  const { default: mod } = modules[key];
  console.log("module loaded:", mod.name);
  app.use("/api", mod.middleware);
}

app.use(express.static(path.resolve(__dirname + "/../../dist")));

server.listen(port, host, () => {
  console.info(`Server listening at http://${host}:${port}`);
});

process.on("exit", () => {
  console.warn("Server has been stopped");
});
