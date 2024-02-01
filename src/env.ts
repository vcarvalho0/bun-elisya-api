import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(8080),
  SECRET: z.string(),
  EXP_DATE: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXP_DATE: z.string(),
  EXPIRE_REFRESH_TOKEN_DB: z.coerce.number()
});

const envServer = envSchema.safeParse(Bun.env);

if (!envServer.success) {
  console.error(envServer.error.format());

  throw new Error("Error environment variables");
}

export const env = envServer.data;
