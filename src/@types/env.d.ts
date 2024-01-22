declare module "bun" {
  interface Env {
    PORT: number;
    ENABLED: boolean;
    LEVEL: string;
  }
}
