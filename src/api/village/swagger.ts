export const VillageSwaggerDocs = {
  paths: {
    "/village": {
      post: {
        tags: ["Villages"],
        summary: "Create new village",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  villageLao: {
                    type: "string",
                    description: "Enter village name in lao",
                    example: "ໂຊກໃຫຍ່",
                  },
                  villageEnglish: {
                    type: "string",
                    description: "Enter village name in english",
                    example: "Sokyai",
                  },
                  districtId: {
                    type: "integer",
                    description: "Enter district id",
                    example: 1,
                  },
                  status: {
                    type: "boolean",
                    description: "Choose village status",
                    example: true,
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
        tags: ["Villages"],
        summary: "Get all villages",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: {
              type: "integer",
            },
            description: "Enter number of page here",
          },
          {
            in: "query",
            name: "limit",
            schema: {
              type: "integer",
            },
            description: "Enter limit of items per page",
          },
          {
            in: "query",
            name: "search",
            schema: {
              type: "string",
            },
            description: "type the keyword for search",
          },
          {
            in: "query",
            name: "districtId",
            schema: {
              type: "integer",
            },
            description: "Enter province id",
          },
          {
            in: "query",
            name: "paginate",
            schema: {
              type: "boolean",
            },
            description: "Choose paginate",
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
    "/village/{id}": {
      get: {
        tags: ["Villages"],
        summary: "Get villages by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "Enter village id for query",
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
        tags: ["Villages"],
        summary: "Edit villages by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "Enter village id for edit",
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  villageLao: {
                    type: "string",
                    description: "Enter village name in lao",
                    example: "ໂຊກໃຫຍ່",
                  },
                  villageEnglish: {
                    type: "string",
                    description: "Enter village name in english",
                    example: "Sokyai",
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
    "/village-aggregation": {
      get: {
        tags: ["Villages"],
        summary: "Get villages aggregation",
        security: [{ bearerAuth: [] }],
        description: "This API do not have any parameters or properties",
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