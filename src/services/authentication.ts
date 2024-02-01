import { Elysia, Static, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { cookie } from "@elysiajs/cookie";
import { Unauthorized } from "@src/helpers/errors";
import { prisma } from "@src/db";
import dayjs from "dayjs";
import { env } from "@src/env";

const payloadSchema = t.Object({
  sub: t.String()
});

export const auth = new Elysia()
  .error({
    UNAUTHORIZED: Unauthorized
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "UNAUTHORIZED":
        set.status = 401;
        return { code, message: error.message };
    }
  })
  .use(
    jwt({
      name: "jwt",
      secret: env.SECRET,
      schema: payloadSchema,
      exp: env.EXP_DATE
    })
  )
  .use(
    jwt({
      name: "refreshJwt",
      secret: env.REFRESH_TOKEN_SECRET,
      schema: payloadSchema,
      exp: env.REFRESH_TOKEN_EXP_DATE
    })
  )
  .use(cookie())
  .derive(({ setCookie, cookie, jwt, refreshJwt }) => {
    return {
      authenticateUser: async (payload: Static<typeof payloadSchema>) => {
        const token = await jwt.sign(payload);

        setCookie("access_token", token, {
          httpOnly: true,
          path: "/"
        });

        return token;
      },

      verifyAuthenticateUser: async () => {
        const payload = await jwt.verify(cookie.access_token);

        if (!payload) {
          throw new Unauthorized();
        }

        return payload;
      },

      createRefreshToken: async (payload: Static<typeof payloadSchema>) => {
        const refreshToken = await refreshJwt.sign(payload);

        const refreshTokenExpiresDate = dayjs()
          .add(env.EXPIRE_REFRESH_TOKEN_DB, "days")
          .toDate();

        await prisma.token.create({
          data: {
            userId: payload.sub,
            refreshToken: refreshToken,
            expiresIn: refreshTokenExpiresDate
          }
        });

        return refreshToken;
      }
    };
  });
