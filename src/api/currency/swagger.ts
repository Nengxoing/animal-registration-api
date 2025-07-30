export const CurrencySwaggerDocs = {
  components: {
    schemas: {
      Currency: {
        type: "object",
        required: ["id", "name", "symbol", "code", "status"],
        properties: {
          id: {
            type: "integer",
            description: "Unique identifier for the currency.",
            example: 1,
          },
          name: {
            type: "string",
            description: "Official name of the currency.",
            example: "US Dollar",
            default: "US Dollar",
          },
          symbol: {
            type: "string",
            description: "Symbol representing the currency.",
            example: "$",
            default: "$",
          },
          code: {
            type: "string",
            description: "ISO 4217 currency code.",
            example: "USD",
            default: "USD",
          },
          status: {
            type: "boolean",
            description: "Indicates whether the currency is active.",
            example: true,
            default: true,
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Timestamp when the currency was created.",
            example: "2023-01-01T12:00:00Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Timestamp of the last update to the currency.",
            example: "2023-02-01T12:00:00Z",
          },
        },
      },
    },
  },
  paths: {
    "/currency": {
      post: {
        tags: ["Currency"],
        summary: "Create a new currency entry.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Currency name.",
                    example: "US Dollar",
                    default: "US Dollar",
                  },
                  code: {
                    type: "string",
                    description: "Currency code.",
                    example: "USD",
                    default: "USD",
                  },
                  symbol: {
                    type: "string",
                    description: "Currency symbol.",
                    example: "$",
                    default: "$",
                  },
                  status: {
                    type: "boolean",
                    description: "Indicates if the currency is active.",
                    example: true,
                    default: true,
                  },
                },
                required: ["name", "code", "symbol", "status"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Currency successfully created.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Currency" },
              },
            },
          },
          500: {
            description: "Internal server error occurred.",
          },
        },
      },
      get: {
        tags: ["Currency"],
        summary: "Get all currency",
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
          {
            in: "query",
            name: "officeIds",
            schema: {
              type: "string",
            },
          },
          {
            in: "query",
            name: "officeId",
            schema: {
              type: "integer",
              minimum: 1,
            },
          },
          {
            in: "query",
            name: "officeIds",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "List of currency",
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
    "/currency/{id}": {
      get: {
        tags: ["Currency"],
        summary: "Get currency by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
            },
            description: "Currency id",
          },
        ],
        responses: {
          200: {
            description: "Query successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas" },
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
        tags: ["Currency"],
        summary: "Edit currency by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
            },
            description: "Currency id",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Currency name.",
                    example: "US Dollar",
                    default: "US Dollar",
                  },
                  code: {
                    type: "string",
                    description: "Currency code.",
                    example: "USD",
                    default: "USD",
                  },
                  symbol: {
                    type: "string",
                    description: "Currency symbol.",
                    example: "$",
                    default: "$",
                  },
                  status: {
                    type: "boolean",
                    description: "Indicates if the currency is active.",
                    example: true,
                    default: true,
                  },
                },
                required: ["name", "code", "symbol", "status"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas" },
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
      delete: {
        tags: ["Currency"],
        summary: "Edit currency by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
            },
            description: "Currency id",
          },
        ],
        responses: {
          201: {
            description: "Deleted successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas" },
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
    "/currency-aggregation": {
      get: {
        tags: ["Currency"],
        summary: "Get currency aggregation",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "officeId",
            schema: {
              type: "integer",
              minimum: 1,
            },
          },
          {
            in: "query",
            name: "officeIds",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Query successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas" },
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
}
