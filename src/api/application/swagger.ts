export const ApplicationSwaggerDocs = {
  paths: {
    "/application": {
      post: {
        tags: ["Applications"],
        summary: "Create new application",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  numberId: {
                    type: "integer",
                    description: "Number ID",
                    example: 1,
                  },
                  profileId: {
                    type: "integer",
                    description: "Profile id",
                    example: 1,
                  },
                  folderId: {
                    type: "integer",
                    description: "FolderId id",
                    example: 1,
                  },
                  positionId: {
                    type: "integer",
                    description: "Position id",
                    example: 1,
                  },
                  companyId: {
                    type: "integer",
                    description: "Company id",
                    example: 1,
                  },
                  ApplicationsId: {
                    type: "integer",
                    description: "Applications id",
                    example: 2,
                  },
                  registrationDocumentId: {
                    type: ["integer", "null"],
                    description: "Registration Document id",
                    example: null,
                  },
                  type: {
                    type: "string",
                    description: "Application type",
                    example: "Passport",
                  },
                  dependBy: {
                    type: "string",
                    enum: [
                      "COMPANY",
                      "VILLAGE",
                    ],
                  },
                  status: {
                    type: "string",
                    enum: [
                      "DEFAULT",
                      "PROCESS",
                      "FINISHED",
                    ],
                  },
                  expirationTerm: {
                    type: "string",
                    enum: [
                      "SIX_MONTHS",
                      "ONE_YEAR",
                    ],
                  },
                  issueDate: {
                    type: "string",
                    format: "date",
                    description: "Issue Date",
                    example: "2025-01-01T00:00:00.000Z",
                  },
                  expirationDate: {
                    type: "string",
                    format: "date",
                    description: "Expiration Date",
                    example: "2025-01-01T13:01:13.678Z",
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
                schema: { $ref: "#/components/schemas/CreateNewApplications" },
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
        tags: ["Applications"],
        summary: "Get all applications",
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
            name: "printCount",
            schema: {
              type: "integer",
            },
            description: "Enter print count here",
          },
          {
            in: "query",
            name: "barcode",
            schema: {
              type: "integer",
            },
            description: "Enter print count here",
          },
          {
            in: "query",
            name: "printCountMax",
            schema: {
              type: "integer",
            },
            description: "Enter printCountMax count here",
          },
          {
            in: "query",
            name: "printCountMin",
            schema: {
              type: "integer",
            },
            description: "Enter printCountMin count here",
          },
          {
            in: "query",
            name: "folderId",
            schema: {
              type: "integer",
            },
            description: "folderId id here",
          },
          {
            in: "query",
            name: "ApplicationsId",
            schema: {
              type: "integer",
            },
            description: "ApplicationsId id here",
          },
          {
            in: "query",
            name: "profileId",
            schema: {
              type: "integer",
            },
            description: "profileId id here",
          },
          {
            in: "query",
            name: "dependBy",
            schema: {
              type: "string",
              enum: [
                "COMPANY",
                "VILLAGE",
              ],
            },
            "description": "Select a dependBy for filtering applications",
          },
          {
            in: "query",
            name: "status",
            schema: {
              type: "string",
              enum: [
                "DEFAULT",
                "APPROVED",
                "PROCESS",
                "FINISHED",
              ],
            },
            "description": "Select a status for filtering folders",
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
    "/application-aggregations": {
      get: {
        tags: ["Applications"],
        summary: "Get Application aggregation",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "start",
            schema: {
              type: "string",
              default: "2025-01-05",
              minimum: 1,
            },
            description: "Start number",
          },
          {
            in: "query",
            name: "end",
            schema: {
              type: "string",
              default: "2025-01-11",
              minimum: 1,
            },
            description: "End number",
          },
          {
            in: "query",
            name: "officeId",
            schema: {
              type: "integer",
              minimum: 1,
            },
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
    "/application-log": {
      get: {
        tags: ["Applications"],
        summary: "Get application logs",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "applicationId",
            schema: {
              type: "integer",
            },
            description: "Filter logs by application ID",
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
    "/application/{id}/status": {
      patch: {
        tags: ["Applications"],
        summary: "Change application status",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "Enter application id for change status",
          },
          {
            in: "query",
            name: "folderId",
            required: true,
            schema: {
              type: "integer",
            },
            description: "Enter folder id for check",
          },
        ],
        requestBody: {
          description: "Status should be DEFAULT, PROCESS or FINISHED",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    enum: [
                      "DEFAULT",
                      "PROCESS",
                      "FINISHED",
                    ],
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Changed successfully",
          },
          401: {
            description: "Not found",
          },
          500: {
            description: "Server internal error",
          },
        },
      },
    },
    "/application/update-status": {
      patch: {
        tags: ["Applications"],
        summary: "Update status for multiple applications",
        security: [{ bearerAuth: [] }],
        requestBody: {
          description: "Update status for multiple applications",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  ids: {
                    type: "array",
                    items: {
                      type: "integer",
                    },
                    description: "Array of application IDs to update",
                    example: [1, 2, 3],
                  },
                  status: {
                    type: "string",
                    enum: [
                      "DEFAULT",
                      "PROCESS",
                      "FINISHED",
                    ],
                    description: "New status to set for the applications",
                  },
                },
                required: ["ids", "status"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Applications status updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "success",
                    },
                    message: {
                      type: "string",
                      example: "Applications status updated successfully",
                    },
                    result: {
                      type: "object",
                      properties: {
                        count: {
                          type: "integer",
                          example: 3,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Bad request - IDs and status are required",
          },
          500: {
            description: "Server internal error",
          },
        },
      },
    },
    "/application/{id}": {
      get: {
        tags: ["Applications"],
        summary: "Get Applications by ID",
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
            description: "Enter Applications id",
          },
        ],
        responses: {
          200: {
            description: "Applications details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Applications"],
        summary: "Edit Applications by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: {
              type: "integer",
            },
            description: "Enter Applications id",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  companyId: {
                    type: "integer",
                    description: "companyId id",
                  },
                  positionId: {
                    type: "integer",
                    description: "positionId id",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Create new Applications",
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
};