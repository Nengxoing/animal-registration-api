/* eslint-disable max-lines */
import { response } from "express";

export const OfficeSwaggerDocs = {
  components: {
    schemas: {
      AggregationResponse: {
        example: {
          status: "success",
          message: "Aggregation successful",
          result: {
            total: 1,
            totalActive: 1,
          },
        },
      },
      CreateNewOffice: {
        example: {
          status: "success",
          message: "successfully",
          result: {
            id: 7,
            name: "Loffice",
            provinceId: 1,
            districtId: 1,
            village: "etc",
            status: true,
            createdAt: "2024-12-26T08:37:48.739Z",
            updatedAt: "2024-12-26T08:37:48.739Z",
            deletedAt: null,
          },
        },
      },  
    },
  }, 
  paths: {
    "/office": {
      post: {
        tags: ["Office"],
        summary: "Create new office",
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
                    description: "Office name",
                  },
                  provinceId: {
                    type: "integer",
                    description: "The id of province",
                  },
                  districtId: {
                    type: "integer",
                    description: "The id of district",
                  },
                  village: {
                    type: "string",
                    description: "The name of village",
                  },
                  status: {
                    type: "boolean",
                    description: "Office status",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Create new office",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateNewOffice" },
              },
            },
          },
        },
      },
      get: {
        tags: ["Office"],
        summary: "Get all offices",
        security: [{ bearerAuth: [] }],
        parameters: [
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
            description: "Position query successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PaginatedResponse" },
              },
            },
          },
        },
      },
    },
    "/office-log": {
      get: {
        tags: ["Office"],
        summary: "Get offices logs",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "officeId",
            schema: {
              type: "integer",
            },
            description: "Filter logs by office ID",
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
    "/office/{id}": {
      get: {
        tags: ["Office"],
        summary: "Get office by ID",
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
            description: "Enter office id",
          },
        ],
        responses: {
          200: {
            description: "Office details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateNewOffice" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Office"],
        summary: "Edit office by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "integer",
            },
            description: "Enter office id",
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
                    description: "Office name",
                  },
                  provinceId: {
                    type: "integer",
                    description: "The id of province",
                  },
                  districtId: {
                    type: "integer",
                    description: "The id of district",
                  },
                  village: {
                    type: "string",
                    description: "The name of village",
                  },
                  status: {
                    type: "boolean",
                    description: "Office status",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Create new office",
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
    "/office-aggregation": {
      get: {
        tags: ["Office"],
        summary: "Edit office by ID",
        security: [{ bearerAuth: [] }],
        description: "This API do not have any parameters or properties just send a request to api endpoint than you will get the response",
        responses: {
          200: {
            description: "Get office aggregation",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AggregationResponse" },
              },
            },
          },
        },
      },
    },
  },
};