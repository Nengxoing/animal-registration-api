import "tsconfig-paths/register";
import app from "./app";
import logger from "./middleware/logger/config";
import env from "./utils/env";

const server = app.listen(env.NODE_PORT, env.HOST, () => {
  logger.info("Started", `Listening on ${env.HOST}:${env.NODE_PORT}`);
});

const handleSignal = (signal: string) => {
  return () => {
    logger.info(`${signal} signal received.`);
    logger.info("Closing http server.");
    server.close(() => {
      logger.info("Http server closed.");
      process.exit(0);
    });
  };
};

for (const signal of ["SIGINT", "SIGBREAK", "SIGTERM"]) {
  process.on(signal, handleSignal(signal));
}
