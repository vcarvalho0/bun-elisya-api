declare module "bun" {
  interface Env {
    PORT: number;
    ENABLED: boolean;
    LEVEL: string;
    SECRET: string;
    EXP_DATE: string;
    REFRESH_TOKEN_SECRET: string;
    REFRESH_TOKEN_EXP_DATE: string;
    EXPIRE_REFRESH_TOKEN_DB: number;
  }
}
