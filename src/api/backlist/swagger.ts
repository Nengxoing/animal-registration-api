export const BacklistSwaggerDocs = {
  components: {
    schemas: {
      BlacklistResponse: {
        type: "object",
        properties: {
          status: {
            type: "string",
            example: "success",
          },
          message: {
            type: "string",
            example: "Data retrieved successfully",
          },
        },
      },
    },
  },
  paths: {
    "/backlist": {
      post: {
        tags: ["Backlist"],
        summary: "Create new office",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  companyId: {
                    type: "integer",
                  },
                  reason: {
                    type: "string",
                  },
                  blacklistedBy: {
                    type: "integer",
                  },

                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Create new office",
          },
        },
      },
      get: {
        tags: ["Backlist"],
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
    "/backlist-check": {
      get: {
        tags: ["Backlist"],
        summary: "Get paginated blacklist data",
        description:
          "Retrieve a list of blacklisted entries with optional filtering and pagination.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "name",
            in: "query",
            description: "Filter by first name.",
            schema: {
              type: "string",
            },
          },
          {
            name: "businessCode",
            in: "query",
            description: "Filter by first name.",
            schema: {
              type: "integer",
            },
          },
          {
            name: "businessType",
            in: "query",
            description: "filter by business type.",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Successfully retrieved blacklist data",
          },
          400: {
            description: "Invalid query parameters",
          },
          401: {
            description: "Unauthorized",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
  },
};
