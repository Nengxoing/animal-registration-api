/* eslint-disable max-lines */

export const PriceSwaggerDocs = {
  components: {
    schemas: {
      Price: {
        type: "object",
        properties: {
          status: {
            type: "string",
            example: "ok",
          },
          message: {
            type: "string",
            example: "success",
          },
          meta: {
            type: "object",
            properties: {
              isFirstPage: {
                type: "boolean",
                example: true,
              },
              isLastPage: {
                type: "boolean",
                example: false,
              },
              currentPage: {
                type: "integer",
                example: 1,
              },
              previousPage: {
                type: "integer",
                nullable: true,
                example: null,
              },
              nextPage: {
                type: "integer",
                nullable: true,
                example: null,
              },
              pageCount: {
                type: "integer",
                example: 0,
              },
              totalCount: {
                type: "integer",
                example: 0,
              },
            },
          },
          result: {
            type: "array",
            items: {
              type: "object",
              description: "Individual items in the response (define item schema if applicable)",
              example: [],
            },
          },
        },
      },
    },
  },
  paths: {
    "/price": {
      get: {
        tags: ["Prices"],
        summary: "Get all prices",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "search",
            schema: {
              type: "string",
              minimum: 1,
            },
            description: "search",
          },
          {
            in: "query",
            name: "status",
            schema: {
              type: "boolean",
            },
            description: "Price status",
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
            name: "type",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "If get prices successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Price",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Prices"],
        summary: "Create new prices",
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
                    description: "Price name",
                  },
                  type: {
                    type: "string",
                    enum: [
                      "YELLOW",
                      "BLUE",
                    ],
                    description: "Type of price",
                  },
                  price: {
                    type: "number",
                    format: "float",
                    description: "Price",
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
    },
    "/price/{id}": {
      get: {
        tags: ["Prices"],
        summary: "Get price by ID",
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
            description: "Price id",
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
        tags: ["Prices"],
        summary: "Edit price by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "Price id",
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
                    description: "Price name",
                  },
                  type: {
                    type: "string",
                    description: "Type of price",
                  },
                  price: {
                    type: "number",
                    format: "float",
                    description: "Price",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Edit successfully",
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
    "/price-log": {
      get: {
        tags: ["Prices"],
        summary: "Get folder logs",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "priceId",
            schema: {
              type: "integer",
            },
            description: "Filter logs by price ID",
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
            schema: {
              type: "integer",
            },
            description: "Page number for pagination",
          },
          {
            in: "query",
            name: "limit",
            schema: {
              type: "integer",
            },
            description: "Number of items per page",
          },
        ],
        responses: {
          200: {
            description: "Folder logs retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "ok",
                    },
                    message: {
                      type: "string",
                      example: "success",
                    },
                    logs: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "integer", example: 1 },
                          folderId: { type: "integer", example: 101 },
                          action: { type: "string", example: "CREATE" },
                          changedBy: { type: "integer", example: 5 },
                          changeDate: { type: "string", format: "date-time", example: "2025-01-01T12:00:00Z" },
                          oldPrice: { type: "string", nullable: true, example: null },
                          newPrice: { type: "string", nullable: true, example: "New Folder Name" },
                          oldName: { type: "string", nullable: true, example: null },
                          newName: { type: "string", nullable: true, example: "NF001" },
                        },
                      },
                    },
                    pagination: {
                      type: "object",
                      properties: {
                        page: { type: "integer", example: 1 },
                        limit: { type: "integer", example: 10 },
                        total: { type: "integer", example: 50 },
                      },
                    },
                  },
                },
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
    },
  },
};