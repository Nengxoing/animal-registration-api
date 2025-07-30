export const PositionSwaggerDocs = {
  paths: {
    "/position": {
      get: {
        tags: ["Positions"],
        summary: "Get all positions",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "search",
            schema: {
              type: "string",
            },
            description: "Search",
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
            name: "status",
            schema: {
              type: "boolean",
            },
            description: "Position status",
          },
          {
            in: "query",
            name: "paginate",
            schema: {
              type: "boolean",
            },
            description: "Choose paginate status",
          },
        ],
        responses: {
          200: {
            description: "Position query successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PaginatedResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Positions"],
        summary: "Create new position",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  laoName: {
                    type: "string",
                    description: "Position name(lao)",
                  },
                  englishName: {
                    type: "string",
                    description: "Position name(English)",
                  },
                  status: {
                    type: "boolean",
                    description: "Position status",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Create new position",
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
    "/position/{id}": {
      get: {
        tags: ["Positions"],
        summary: "Get position by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "Enter position id",
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
        tags: ["Positions"],
        summary: "Edit position by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "Enter position id",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  laoName: {
                    type: "string",
                    description: "Position name(lao)",
                  },
                  englishName: {
                    type: "string",
                    description: "Position name(English)",
                  },
                  status: {
                    type: "boolean",
                    description: "Position status",
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
    "/position-aggregation": {
      get: {
        tags: ["Positions"],
        summary: "Get position aggregation",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Get position aggregation",
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
  },
};