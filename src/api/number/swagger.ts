export const NumberSwaggerDocs = {
  components: {
    schemas: {
      ResponseNumber: {
        example: {
          status: "ok",
          message: "success",
          meta: {
            isFirstPage: true,
            isLastPage: true,
            currentPage: 1,
            previousPage: null,
            nextPage: null,
            pageCount: 1,
            totalCount: 0,
          },
          result: [],
        },
      },
    },
  },
  paths: {
    "/number": {
      get: {
        tags: ["Numbers"],
        summary: "Get all numbers",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "folderId",
            required: true,
            schema: {
              type: "integer",
            },
            description: "Enter folderId here",
          },
          {
            in: "query",
            name: "paginate",
            required: true,
            schema: {
              type: "boolean",
            },
            description: "Choose paginate here",
          },
          {
            in: "query",
            name: "page",
            schema: {
              type: "integer",
              minimum: 1,
            },
            description: "Enter page number here",
          },
          {
            in: "query",
            name: "limit",
            schema: {
              type: "integer",
              minimum: 1,
            },
            description: "Enter number of item per page here",
          },
          {
            in: "query",
            name: "isAvailable",
            schema: {
              type: "boolean",
            },
          },
        ],
        responses: {
          200: {
            description: "Number query successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ResponseNumber" },
              },
            },
          },
        },
      },
    },
    "/number-folder-aggregation": {
      get: {
        tags: ["Numbers"],
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
          {
            in: "query",
            name: "folderId",
            schema: {
              type: "integer",
            },
          },
          {
            in: "query",
            name: "numberId",
            schema: {
              type: "integer",
            },
          },
        ],
        responses: {
          200: {
            description: "List of applications with optional filters",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas" }
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