export const RefundSwaggerDocs = {
  components: {
    schemas: {
      RefundResponse: {
        type: "object",
        properties: {
          status: {
            type: "string",
            example: "ok",
          },
          message: {
            type: "string",
            example: "Refund created successfully",
          },
          result: {
            type: "object",
            properties: {
              numberId: {
                type: "integer",
                example: 1,
              },
              officeId: {
                type: "integer",
                example: 5,
              },
              priceAmount: {
                type: "integer",
                example: 3,
              },
              priceId: {
                type: "integer",
                example: 2,
              },
              createById: {
                type: "integer",
                example: 1,
              },
              createdAt: {
                type: "string",
                format: "date-time",
                example: "2025-02-05T00:00:00Z",
              },
              updatedAt: {
                type: "string",
                format: "date-time",
                example: "2025-02-05T00:00:00Z",
              },
            },
          },
        },
      },
    },
  },
  paths: {
    "/refund": {
      post: {
        tags: ["Refund"],
        summary: "Create new refund",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  numberId: {
                    type: "integer",
                    description: "Folder ID associated with the refund",
                  },
                  priceAmount: {
                    type: "integer",
                    description: "Total number of refunds",
                  },
                  priceId: {
                    type: "integer",
                    description: "Total number of refunds",
                  },
                },
                required: ["numberId", "priceAmount", "priceId"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Refund created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RefundResponse" },
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
        tags: ["Refund"],
        summary: "Retrieve all applications with optional filters",
        parameters: [
          {
            in: "query",
            name: "officeId",
            schema: {
              type: "integer",
            },
            description: "Enter officeId here",
          },
        ],
        responses: {
          200: {
            description: "List of applications with optional filters",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/RefundResponse" }
                }
              }
            }
          },
          500: {
            description: "Failed to fetch applications"
          }
        }
      },
    },
  },
};
