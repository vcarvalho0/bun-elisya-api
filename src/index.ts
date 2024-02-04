import { Elysia } from "elysia";
import logger from "./logger";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { userRoutes } from "./routes/user";
import { signOut } from "./routes/sign-out";
import { refreshTokenRoute } from "./routes/refresh-token";
import { recoverPasswordLinkRoute } from "./routes/recover-password-link";
import { env } from "./env";

const app = new Elysia()
  .use(
    cors({
      credentials: true,
      methods: ["GET", "POST", "DELETE", "PATCH", "HEAD", "OPTIONS"]
    })
  )
  .group("/api", (app) =>
    app
      .use(
        swagger({
          path: "/docs",
          documentation: {
            info: {
              title: "My Elysia API docs",
              version: "1.0.0"
            }
          }
        })
      )
      .use(userRoutes)
      .use(refreshTokenRoute)
      .use(recoverPasswordLinkRoute)
      .use(signOut)
  )
  .listen(env.PORT);

logger.info(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
