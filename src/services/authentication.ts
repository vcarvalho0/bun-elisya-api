import { Elysia, Static, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { cookie } from "@elysiajs/cookie";
import { Unauthorized } from "@src/helpers/errors";

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
      secret: process.env.SECRET,
      schema: payloadSchema,
      exp: process.env.EXP_DATE
    })
  )
  .use(cookie())
  .derive(({ setCookie, cookie, jwt }) => {
    return {
      authenticateUser: async (payload: Static<typeof payloadSchema>) => {
        const token = await jwt.sign(payload);

        setCookie("access_token", token, {
          httpOnly: true,
          path: "/"
        });

        return token;
      },

      isAuthenticated: async () => {
        const payload = await jwt.verify(cookie.access_token);

        if (!payload) {
          throw new Unauthorized();
        }

        return payload;
      }
    };
  });
