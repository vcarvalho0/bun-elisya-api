import { Elysia } from "elysia";
import logger from "./logger";
import App from "./env";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";

const app = new Elysia()
  .use(
    cors({
      methods: ["GET", "POST", "DELETE", "PATCH", "HEAD", "OPTIONS"]
    })
  )
  .use(
    swagger({
      documentation: {
        info: {
          title: "API with Elysia",
          version: "1.0"
        }
      }
    })
  )
  .get("/", () => "Hello Elysia")
  .listen(App.config.port);

logger.info(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
