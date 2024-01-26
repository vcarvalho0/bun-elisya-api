import { auth } from "@src/middleware/authentication";
import Elysia from "elysia";

export const signOut = new Elysia()
  .use(auth)
  .post("/sign-out", ({ removeCookie }) => {
    removeCookie("access_token");
  });
