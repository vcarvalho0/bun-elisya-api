import { Elysia, t } from "elysia";
import { prisma } from "@src/db";
import { auth } from "@src/middleware/authentication";
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
          name: body.name,
          password: hash
        }
      });
    },
    {
      body: t.Object({
        email: t.String(),
        name: t.String(),
        password: t.String()
      })
    }
  )
  .post(
    "/login",
    async ({ body, authenticateUser }) => {
      const user = await prisma.user.findUnique({
        where: { email: body.email }
      });

      if (!user || !(await comparePasswords(body.password, user.password))) {
        throw new InvalidCredentialsError();
      }

      await authenticateUser({
        sub: user.id
      });

      return user;
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String()
      })
    }
  )
  .get("/me", async ({ isAuthenticated }) => {
    const payload = await isAuthenticated();

    const userInfo = await prisma.user.findUnique({
      where: { id: payload.sub }
    });

    return userInfo;
  });
