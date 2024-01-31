import { auth } from "@src/services/authentication";
import Elysia from "elysia";

export const signOut = new Elysia()
  .use(auth)
  .post("/sign-out", ({ removeCookie }) => {
    removeCookie("access_token");
  });
