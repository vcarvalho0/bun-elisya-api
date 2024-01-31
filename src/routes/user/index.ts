import { Elysia, t } from "elysia";
import { prisma } from "@src/db";
import { auth } from "@src/services/authentication";
import { comparePasswords, hashPassword } from "@src/services/hash-password";
import {
  AlreadyExistError,
  InvalidCredentialsError
} from "@src/helpers/errors";

export const userRoutes = new Elysia()
  .use(auth)
  .post(
    "/user",
    async ({ body }) => {
      const userExist = await prisma.user.findUnique({
        where: { email: body.email }
      });

      if (userExist) {
        throw new AlreadyExistError();
      }

      const hash = await hashPassword(body.password);

      return await prisma.user.create({
        data: {
          email: body.email,
          username: body.username,
          password: hash
        }
      });
    },
    {
      body: t.Object({
        email: t.String(),
        username: t.String(),
        password: t.String()
      })
    }
  )
  .post(
    "/login",
    async ({ body, authenticateUser, createRefreshToken }) => {
      const user = await prisma.user.findUnique({
        where: { email: body.email }
      });

      if (!user || !(await comparePasswords(body.password, user.password))) {
        throw new InvalidCredentialsError();
      }

      const token = await authenticateUser({
        sub: user.id
      });

      await prisma.token.deleteMany({
        where: {
          userId: user.id
        }
      });

      const refreshToken = await createRefreshToken({
        sub: user.id
      });

      return { token, refreshToken };
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String()
      })
    }
  )
  .get("/me", async ({ verifyAuthenticaUser }) => {
    const payload = await verifyAuthenticaUser();

    const userInfo = await prisma.user.findUnique({
      where: { id: payload.sub }
    });

    return userInfo;
  });
