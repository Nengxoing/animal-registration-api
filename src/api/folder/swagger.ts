export const FolderSwaggerDocs = {
  paths: {
    "/folder": {
      post: {
        tags: ["Folders"],
        summary: "Create new folder",
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
                    description: "Folder name",
                    example: "LIT Solution",
                    minLength: 1,
                  },
                  officeId: {
                    type: "integer",
                    description: "Enter office id",
                    example: 1,
                  },
                  folderPrice: {
                    type: "array",
                    description: "Array of folder prices",
                    items: {
                      type: "object",
                      properties: {
                        amount: {
                          type: "integer",
                          description: "Enter amount",
                          example: 1,
                          minimum: 1,
                        },
                        priceId: {
                          type: "integer",
                          description: "Enter price id",
                          example: 1,
                          minimum: 1,
                        },
                      },
                      required: ["amount", "priceId"],
                    },
                  },
                },
                required: ["name"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Created successfully",
            content: {
              "application/json": {
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
        tags: ["Folders"],
        summary: "Get all folders",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "priceId",
            schema: {
              type: "integer",
            },
            description: "Enter price id here",   
          },
          {
            in: "query",
            name: "officeId",
            schema: {
              type: "integer",
            },
            description: "Enter officeId id here",   
          },
          {
            in: "query",
            name: "search",
            schema: {
              type: "string",
            },
            description: "Enter something here for search",   
          },
          {
            in: "query",
            name: "page",
            schema: {
              type: "integer",
            },
            description: "Enter page number here",
          },
          {
            in: "query",
            name: "limit",
            schema: {
              type: "integer",
            },
            description: "Enter limit here(Items per page)",
          },
          {
            in: "query",
            name: "paginate",
            required: true,
            example: true,
            schema: {
              type: "boolean",
            },
            description: "Choose paginate",
          },
          {
            in: "query",
            name: "expandPrice",
            schema: {
              type: "boolean",
            },
            description: "Enter expandPrice id here",
          },
          {
            in: "query",
            name: "expandNumber",
            schema: {
              type: "boolean",
            },
            description: "Enter expandNumber id here",
          },
          {
            in: "query",
            name: "status",
            schema: {
              type: "string",
              enum: [
                "DEFAULT",
                "PENDING",
                "APPROVED_BY_POLICE",
                "FINANCE_UNDER_REVIEW",
                "POLICE_UNDER_REVIEW",
                "IN_PRODUCTION",
                "FINISHED",
              ],
            },
            "description": "Select a status for filtering folders",
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
    "/folder/{id}": {
      get: {
        tags: ["Folders"],
        summary: "Get folder by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "Enter folder id here",
          },
          {
            in: "query",
            name: "expandPrice",
            schema: {
              type: "boolean",
            },
            description: "Enter expandPrice id here",   
          },
          {
            in: "query",
            name: "expandNumber",
            schema: {
              type: "boolean",
            },
            description: "Enter expandNumber id here",   
          },
        ],
        responses: {
          200: {
            description: "Get folder by ID",
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
        tags: ["Folders"],
        summary: "Edit folder by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "Enter folder id that you need edit",
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
                    description: "Folder name",
                    example: "LIT Solution",
                  },
                  priceId: {
                    type: "integer",
                    description: "Enter price id",
                    example: 1,
                  },
                  totalApplications: {
                    type: "integer",
                    description: "Total applications",
                    example: 10,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Edit folder successfully",
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
    "/folder-aggregation": {
      get: {
        tags: ["Folders"],
        summary: "Get folder aggregation",
        parameters: [
          {
            in: "query",
            name: "status",
            required: true,
            schema: {
              type: "string",
              enum: [
                "DEFAULT",
                "PENDING",
                "APPROVED_BY_POLICE",
                "FINANCE_UNDER_REVIEW",
                "POLICE_UNDER_REVIEW",
                "IN_PRODUCTION",
                "FINISHED",
              ],
            },
            "description": "Select a status for filtering folders",
          },
          {
            in: "query",
            name: "officeId",
            schema: {
              type: "integer",
            }
          },
        ],
        responses: {},
      },
    },
    "/folder/{id}/progress": {
      patch: {
        tags: ["Folders"],
        summary: "Status folder",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "Enter folder id",
          },
        ],
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
    "/folder-log": {
      get: {
        tags: ["Folders"],
        summary: "Get folder logs",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "folderId",
            schema: {
              type: "integer",
            },
            description: "Filter logs by folder ID",
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
                          action: {
                            type: "string",
                            example: "CREATE",
                          },
                          changedBy: {
                            type: "integer",
                            example: 5,
                          },
                          changeDate: {
                            type: "string",
                            format: "date-time",
                            example: "2025-01-01T12:00:00Z",
                          },
                          oldName: {
                            type: "string",
                            nullable: true,
                            example: null,
                          },
                          newName: {
                            type: "string",
                            nullable: true,
                            example: "New Folder Name",
                          },
                          oldCode: {
                            type: "string",
                            nullable: true,
                            example: null,
                          },
                          newCode: {
                            type: "string",
                            nullable: true,
                            example: "NF001",
                          },
                          oldStatus: {
                            type: "string",
                            nullable: true,
                            example: "DEFAULT",
                          },
                          newStatus: {
                            type: "string",
                            nullable: true,
                            example: "PENDING",
                          },
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


