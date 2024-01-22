import App from "./env";
import { pino } from "pino";

export default pino({
  enabled: App.logger.enabled,
  level: App.logger.level
});
