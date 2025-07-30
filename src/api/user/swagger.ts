/* eslint-disable max-lines */

export const UserSwaggerDocs = {
  paths: {
    "/user": {
      post: {
        tags: ["Users"],
        summary: "Create new user",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  firstName: {
                    type: "string",
                    description: "First name",
                    example: "super",
                  },
                  username: {
                    type: "string",
                    description: "First name",
                    example: "admin",
                  },
                  lastName: {
                    type: "string",
                    description: "Last name",
                    example: "admin",
                  },
                  phone: {
                    type: "string",
                    description: "Phone",
                    example: "98989898",
                    pattern: "^[0-9]{8}$",
                  },
                  email: {
                    type: "string",
                    description: "Email",
                    format: "email",
                    example: "admin@gmail.com",
                  },
                  password: {
                    type: "string",
                    description: "Password",
                    example: "Lit@2024",
                  },
                  role: {
                    type: "string",
                    description: "User role",
                    example: "ADMIN",
                  },
                  officeId: {
                    type: "number",
                    description: "Office ID",
                    example: 1,
                  },
                  userOffice: {
                    type: "array",
                    description: "Array of folder userOffices",
                    items: {
                      type: "object",
                      properties: {
                        officeId: {
                          type: "integer",
                          description: "Office ID",
                          example: 1,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateNewOffice" },
              },
            },
          },
          400: {
            description: "Bad request",
          },
          500: {
            description: "Server internal error",
          },
        },
      },
      get: {
        tags: ["Users"],
        summary: "Get all Users",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: {
              type: "integer",
              minimum: 1,
            },
            description: "Page number",
          },
          {
            in: "query",
            name: "limit",
            schema: {
              type: "integer",
              minimum: 1,
            },
            description: "Items per page",
          },
        ],
        responses: {
          200: {
            description: "List of users",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PaginatedResponse",
                },
              },
            },
          },
        },
      },
    },
    "/user-log": {
      get: {
        tags: ["Users"],
        summary: "Get user logs",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "userId",
            schema: {
              type: "integer",
            },
            description: "Filter logs by user ID",
          },
          {
            in: "query",
            name: "action",
            schema: {
              type: "string",
              enum: ["CREATE", "UPDATE", "DELETE"],
            },
            description: "Filter logs by action type",
          },
          {
            in: "query",
            name: "page",
            example: 1,
            schema: {
              type: "integer",
            },
            description: "Enter page number here",
          },
          {
            in: "query",
            name: "limit",
            example: 10,
            schema: {
              type: "integer",
            },
            description: "Enter number of items per page here",
          },

        ],
        responses: {
          200: {
            description: "Query successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PaginatedResponse" },
              },
            },
          },
          404: {
            description: "Not found",
          },
          500: {
            description: "Server internal error",
          },
        },
      },
    },
    "/user-aggregation": {
      get: {
        tags: ["Users"],
        summary: "Get user aggregation",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "filter",
            description: "Fillter",
          },
        ],
        responses: {
          200: {
            description: "Query successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AggregationResponse" },
              },
            },
          },
          404: {
            description: "Not found",
          },
          500: {
            description: "Server internal error",
          },
        },
      },
    },
    "/user/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get user by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            description: "The ID of the user to retrieve",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "Query successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateNewOffice" },
              },
            },
          },
          404: {
            description: "Not found",
          },
          500: {
            description: "Server internal error",
          },
        },
      },
      put: {
        tags: ["Users"],
        summary: "Update user by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            description: "The ID of the user to update",
            schema: {
              type: "integer",
            },
          },
        ],
        requestBody: {
          description: "User role (ADMIN, FINANCE, POLICE_OFFICER, POLICE_COMMANDER, FARMER, POLICE_PRODUCTION)",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  firstName: {
                    type: "string",
                    description: "First name",
                    example: "Meng",
                  },
                  lastName: {
                    type: "string",
                    description: "Last name",
                    example: "Moua",
                  },
                  phone: {
                    type: "string",
                    description: "Phone number",
                    minLength: 8,
                    maxLength: 11,
                    pattern: "^[0-9]+$",
                    example: "98123456",
                  },
                  password: {
                    type: "string",
                    description: "Password (optional)",
                    minLength: 8,
                    example: "password123",
                  },
                  email: {
                    type: "string",
                    description: "Email address",
                    pattern: "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$",
                    example: "johndoe@example.com",
                  },
                  role: {
                    type: "string",
                    description: "User role",
                    enum: [
                      "ADMIN",
                      "FINANCE",
                      "POLICE_OFFICER",
                      "POLICE_COMMANDER",
                      "FARMER",
                      "POLICE_PRODUCTION",
                    ],
                  },
                  officeId: {
                    type: "integer",
                    description: "Office Id",
                    example: 2,
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateNewOffice" },
              },
            },
          },
          404: {
            description: "Not found",
          },
          500: {
            description: "Server internal error",
          },
        },
      },
    },
  },
};
