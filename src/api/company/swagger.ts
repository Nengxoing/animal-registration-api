/* eslint-disable max-lines */
export const CompanySwaggerDocs = {
  paths: {
    "/company": {
      post: {
        tags: ["Companys"],
        summary: "Create new company",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Company name",
                    example: "ABC Co., Ltd.",
                  },
                  businessCode: {
                    type: "string",
                    description: "Unique business code",
                    example: "B123456789",
                  },
                  documentFile: {
                    type: "string",
                    format: "binary",
                    description: "Upload document file",
                  },
                  businessRegisterBy: {
                    type: "string",
                    enum: [
                      "government",
                      "ministry",
                      "province",
                      "district",
                    ],
                  },
                  status: {
                    type: "integer",
                    description: "Status of the company (e.g., 1 for active, 0 for inactive)",
                    example: 1,
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
        tags: ["Companys"],
        summary: "Get all companys",
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
    "/company-log": {
      get: {
        tags: ["Companys"],
        summary: "Get company logs",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "companyId",
            schema: {
              type: "integer",
            },
            description: "Filter logs by company ID",
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
    "/company/{id}": {
      get: {
        tags: ["Companys"],
        summary: "Get company by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "Enter company id",
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
        tags: ["Companys"],
        summary: "Edit company by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "Enter company id that you need edit",
          },
        ],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Company name",
                    example: "ABC Co., Ltd.",
                  },
                  businessCode: {
                    type: "string",
                    description: "Unique business code",
                    example: "B123456789",
                  },
                  documentFile: {
                    type: "string",
                    format: "binary",
                    description: "Upload document file",
                  },
                  status: {
                    type: "integer",
                    description: "New status of the company",
                    example: 0,
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Created successfully",
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
    "/company-aggregation": {
      get: {
        tags: ["Companys"],
        summary: "Get company aggregation",
        security: [{ bearerAuth: [] }],
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