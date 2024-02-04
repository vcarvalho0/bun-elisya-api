import jwt from "@elysiajs/jwt";
import { prisma } from "@src/db";
import Elysia, { t } from "elysia";

export const recoverPasswordLinkRoute = new Elysia()
  .use(
    jwt({
      name: "recoverPassword",
      secret: "mysecretresetpassword",
      exp: "15m"
    })
  )
  .post(
    "/recover-password/",
    async ({ body, recoverPassword }) => {
      const { email } = body;

      const findEmail = await prisma.user.findFirst({
        where: {
          email
        }
      });

      if (!findEmail) {
        throw new Error("Email not found");
      }

      const recoverPasswordToken = await recoverPassword.sign({ sub: email });

      const createRecoverLink = new URL(
        "/recover-password/",
        "http://localhost:8080"
      );
      createRecoverLink.searchParams.set("code", recoverPasswordToken);

      return { recover_password_link: createRecoverLink.toString() };
    },
    {
      body: t.Object({
        email: t.String()
      })
    }
  );
