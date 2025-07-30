/* eslint-disable max-lines */
export const NationalitySwaggerDocs = {
  paths: {
    "/nationality": {
      post: {
        tags: ["Nationality"],
        summary: "Create new nationality",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { 
                type: "object",
                required: ["name", "nationality", "code", "continent"],
                properties: {
                  name: { 
                    type: "string", 
                    description: "Lao name of the country", 
                  },
                  nationality: { 
                    type: "string", 
                    description: "English name of the country", 
                  },
                  code: { 
                    type: "string", 
                    description: "Country code", 
                  },
                  continent: { 
                    type: "string", 
                    description: "Continent name", 
                  },
                  status: {
                    type: "boolean",
                    nullable: true,
                    description: "Status of the country",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Nationality added successfully",
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
        tags: ["Nationality"],
        summary: "Get all nationality",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "search",
            schema: {
              type: "string",
            },
            description: "Enter some text here for search",
          },
          {
            in: "query",
            name: "paginate",
            schema: {
              type: "boolean",
            },
            description: "Choose paginate",
          },
          {
            in: "query",
            name: "continent",
            schema: {
              type: "string",
            },
            description: "Enter continent",
          },
          {
            in: "query",
            name: "code",
            schema: {
              type: "string",
            },
            description: "Enter code",
          },
          {
            in: "query",
            name: "status",
            schema: {
              type: "boolean",
            },
            description: "Choose status",
          },
          {
            in: "query",
            name: "page",
            schema: {
              type: "string",
            },
            description: "page",
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
    "/nationality/{id}": {
      get: {
        tags: ["Nationality"],
        summary: "Get nationality by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "Enter nationality id here",
          },
        ],
        responses: {
          200: {
            description: "Create new office",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/nationalityResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Nationality"],
        summary: "Edit nationality aggregation",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { 
                type: "object",
                required: ["name", "nationality", "code", "continent"],
                properties: {
                  name: { 
                    type: "string", 
                    description: "Lao name of the country", 
                  },
                  nationality: { 
                    type: "string", 
                    description: "English name of the country", 
                  },
                  code: { 
                    type: "string", 
                    description: "Country code", 
                  },
                  continent: { 
                    type: "string", 
                    description: "Continent name", 
                  },
                  status: {
                    type: "boolean",
                    nullable: true,
                    description: "Status of the country",
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
    "/nationality-aggregation": {
      get: {
        tags: ["Nationality"],
        summary: "Get nationality aggregation",
        security: [{ bearerAuth: [] }],
        description: "This API do not have any parameters and properties",
        responses: {
          200: {
            description: "Get nationality aggregation",
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
