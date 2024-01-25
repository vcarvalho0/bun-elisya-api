declare module "bun" {
  interface Env {
    PORT: number;
    ENABLED: boolean;
    LEVEL: string;
    SECRET: string;
    EXP_DATE: string;
  }
}
