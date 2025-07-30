
export const CategorySwaggerDocs = {
  components: {
    schemas: {
      Category: {
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
          meta: {
            type: "object",
            properties: {
              isFirstPage: {
                type: "boolean",
                example: true,
              },
              isLastPage: {
                type: "boolean",
                example: false,
              },
              currentPage: {
                type: "integer",
                example: 1,
              },
              previousPage: {
                type: "integer",
                nullable: true,
                example: null,
              },
              nextPage: {
                type: "integer",
                nullable: true,
                example: null,
              },
              pageCount: {
                type: "integer",
                example: 0,
              },
              totalCount: {
                type: "integer",
                example: 0,
              },
            },
          },
          result: {
            type: "array",
            items: {
              type: "object",
              description: "Individual items in the response",
              example: [],
            },
          },
        },
      },
    },
  },
  paths: {
        "/category": {
          get: {
            tags: ["Category"],
            summary: "Get all categories",
            security: [{ bearerAuth: [] }],
            parameters: [
              {
                in: "query",
                name: "page",
                schema: {
                  type: "integer",
                },
                description: "Search",
            },
              {
                in: "query",
                name: "limit",
                schema: {
                  type: "integer",
                },
                description: "Search",
              },
                {
                    in: "query",
                    name: "search",
                    schema: {
                    type: "string",
                    minimum: 1,
                    },
                    description: "Search by category name",
                },
                {
                    in: "query",
                    name: "status",
                    schema: {
                    type: "string",
                    enum: ["true", "false"],
                    },
                    description: "Filter by status (true/false)",
                },
            ],
            responses: {
              200: {
                description: "Success",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Category",
                    },
                  },
                },
              },
            }
          },
          post: {
            tags: ["Category"],
            summary: "Create a new category",
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
                        description: "Name of the category",
                        example: "Dog",
                      },
                      status: {
                        type: "boolean",
                        description: "Status of the category",
                        example: true,
                      },
                    },
                  },
                },
              },
            },
            responses: {
              201: {
                description: "Category created successfully",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Category",
                    },
                  },
                },
              },
              400: {
                description: "Bad Request",
              },
            },
          },
        },
    },
  }