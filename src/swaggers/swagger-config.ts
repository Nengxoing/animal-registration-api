import { swaggerUi, swaggerSpec } from "./swagger-options";
import path from "path";
import express from "express";
import env from "../utils/env";
import { swaggerVerify } from "./jwt";

export const configureSwagger = (app: express.Application) => {
  app.use(
    "/swagger",
    swaggerVerify,
    ...(swaggerUi.serve as unknown as express.RequestHandler[]),
    swaggerUi.setup(swaggerSpec, {
      explorer: false,
      customCss: ".swagger-ui .topbar { display: none }",
      swaggerOptions: {
        filter: true,
        docExpansion: "none",
        defaultModelsExpandDepth: -1,
        displayRequestDuration: true,
        deepLinking: true,
        tagsSorter: "alpha",
        operationsSorter: "method",
        persistAuthorization: true,
      },
    }),
  );
  app.use(express.static(path.join(env.PWD, "dist", "swagger")));
  app.use(express.static(path.join(env.PWD, "uploads")));
};
