
import swaggerJsdoc from "swagger-jsdoc";
import * as swaggerUi from "swagger-ui-express";
import { RegistrySwaggerDocs } from "./registry";

interface SwaggerOptions extends swaggerJsdoc.Options { }

const options: SwaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API documentation for the Boilerplate API",
      contact: {
        name: "API Support",
        email: "support@api.com",
        url: "https://github.com/Thavisoukmnlv9",
      },
      termsOfService: "https://github.com/Thavisoukmnlv9",
    },
    servers: [
      {
        url: "",
        description: "API v1",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: RegistrySwaggerDocs.components.schemas,
    },
    paths: RegistrySwaggerDocs.paths,
    responses: {
      BadRequest: {
        description: "Bad Request",
        content: {
          "application/json": {
            schema: { type: "object", example: { message: "Invalid input" } },
          },
        },
      },
      Unauthorized: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: {
              type: "object",
              example: { message: "Authentication failed" },
            },
          },
        },
      },
      InternalServerError: {
        description: "Internal Server Error",
        content: {
          "application/json": {
            schema: {
              type: "object",
              example: { message: "Something went wrong" },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/api/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec, swaggerUi };
