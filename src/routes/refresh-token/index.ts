import { prisma } from "@src/db";
import { auth } from "@src/services/authentication";
import Elysia, { t } from "elysia";

export const refreshTokenRoute = new Elysia().use(auth).post(
  "/refresh-token",
  async ({ body, refreshJwt, authenticateUser, createRefreshToken }) => {
    const { refreshToken } = body;

    const isRefreshTokenValid = await refreshJwt.verify(refreshToken);

    if (!isRefreshTokenValid) {
      throw new Error("Invalid refresh token or expired");
    }

    const userToken = await prisma.token.findFirst({
      where: { userId: isRefreshTokenValid.sub }
    });

    if (!userToken) {
      throw new Error("Refresh token not found");
    }

    const generateNewToken = await authenticateUser({
      sub: userToken.userId
    });

    await prisma.token.deleteMany({
      where: {
        userId: userToken.userId
      }
    });

    const generateNewRefreshToken = await createRefreshToken({
      sub: userToken.userId
    });

    return {
      newToken: generateNewToken,
      newRefreshToken: generateNewRefreshToken
    };
  },
  {
    body: t.Object({
      refreshToken: t.String()
    })
  }
);
