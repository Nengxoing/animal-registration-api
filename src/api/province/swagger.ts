export const ProvinceSwaggerDocs = {
  paths: {
    "/province": {
      post: {
        tags: ["Provinces"],
        summary: "Create a new province",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "integer",
                      description: "Province name(lao)",
                    },
                    provinceLao: {
                      type: "string",
                      description: "Province name(lao)",
                    },
                    provinceEnglish: {
                      type: "string",
                      description: "Province name(English)",
                    },
                    status: {
                      type: "boolean",
                      description: "Province status",
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Province created successfully",
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
        tags: ["Provinces"],
        summary: "Get all provinces",
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
            description: "List of provinces",
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
    "/province/{id}": {
      get: {
        tags: ["Provinces"],
        summary: "Get a province by ID",
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
            description: "Enter province id",
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
        tags: ["Provinces"],
        summary: "Edit a province by ID",
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
            description: "Enter province id",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "englishName"],
                properties: {
                  name: {
                    type: "string",
                    description: "Province name(lao)",
                  },
                  englishName: {
                    type: "string",
                    description: "English name of province",
                  },
                  status: {
                    type: "boolean",
                    description: "Status",
                    example: true,
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
    "/province-aggregation": {
      get: {
        tags: ["Provinces"],
        summary: "Get provinces aggregation",
        security: [{ bearerAuth: [] }],
        description: "This API do not have any parameter or properties.",
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
  },
};
