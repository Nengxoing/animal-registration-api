export const DistrictSwaggerDocs = {
  paths: {
    "/district": {
      post: {
        tags: ["Districts"],
        summary: "Create new district",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    districtLao: {
                      type: "string",
                      description: "Enter district name in lao",
                      example: "ນະຄອນຫຼວງວຽງຈັນ",
                    },
                    districtEnglish: {
                      type: "string",
                      description: "Enter district name in english",
                      example: "Vientiane capital",
                    },
                    provinceId: {
                      type: "integer",
                      description: "Enter province id",
                      example: 1,
                    },
                    status: {
                      type: "boolean",
                      description: "Choose district status",
                      example: true,
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
        tags: ["Districts"],
        summary: "Get all districts",
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
            name: "provinceId",
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
    
    "/district/{id}": {
      get: {
        tags: ["Districts"],
        summary: "Get districts by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "Enter district id for query",
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
        tags: ["Districts"],
        summary: "Edit districts by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "Enter dictrict id for edit",
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  districtLao: {
                    type: "string",
                    description: "Enter district name in lao",
                    example: "ນະຄອນຫຼວງວຽງຈັນ",
                  },
                  districtEnglish: {
                    type: "string",
                    description: "Enter district name in english",
                    example: "Vientiane capital",
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
    "/district-aggregation": {
      get: {
        tags: ["Districts"],
        summary: "Get districts aggregation",
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