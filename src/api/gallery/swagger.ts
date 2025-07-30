export const GallerySwaggerDocs = {
  components: {
    schemas: {
      Gallery: {
        type: "object",
        required: ["id", "name"],
        properties: {
          id: {
            type: "integer",
            description: "Gallery ID",
          },
          name: {
            type: "string",
            description: "Gallery name",
          },
          image: {
            type: "string",
            nullable: true,
            description: "Gallery image URL",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Creation timestamp",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Last update timestamp",
          },
        },
      },
    },
  },
  paths: {
    "/gallery": {
      post: {
        tags: ["Gallery"],
        summary: "Create a new gallery",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Image Name",
                  },
                  image: {
                    type: "string",
                    format: "binary",
                    description: "Gallery image file (new image)",
                  },
                  required: ["name", "image"],
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Gallery created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Gallery",
                },
              },
            },
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "error",
                    },
                    message: {
                      type: "string",
                      example: "An unexpected error occurred",
                    },
                  },
                },
              },
            },
          },
        },
      },
      get: {
        tags: ["Gallery"],
        summary: "Get all gallery",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: {
              type: "integer",
              minimum: 1,
            },
            description: "Page number",
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
          {
            in: "query",
            name: "officeIds",
            schema: {
              type: "string",
            },
          },
          {
            in: "query",
            name: "officeId",
            schema: {
              type: "integer",
              minimum: 1,
            },
          },
          {
            in: "query",
            name: "officeIds",
            schema: {
              type: "string",
            },
          },
          {
            in: "query",
            name: "createdAt",
            schema: {
              type: "string",
              minimum: 1,
            },
            description: "createdAt number",
          },
        ],
        responses: {
          200: {
            description: "List of gallery",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PaginatedResponse",
                },
              },
            },
          },
        },
      },
    },
    "/gallery/{id}": {
      get: {
        tags: ["Gallery"],
        summary: "Get gallery by ID",
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
            description: "Gallery id",
          },
        ],
        responses: {
          200: {
            description: "Query successfully",
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
      put: {
        tags: ["Gallery"],
        summary: "Edit gallery by ID",
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
            description: "Gallery id",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Image Name",
                  },
                  image: {
                    type: "string",
                    format: "binary",
                    description: "Gallery image file (new image)",
                  },
                  required: ["name", "image"],
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Updated successfully",
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
      delete: {
        tags: ["Gallery"],
        summary: "Edit gallery by ID",
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
            description: "Gallery id",
          },
        ],
        responses: {
          201: {
            description: "Deleted successfully",
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
    "/gallery-aggregation": {
      get: {
        tags: ["Gallery"],
        summary: "Get gallery aggregation",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "officeId",
            schema: {
              type: "integer",
              minimum: 1,
            },
          },
          {
            in: "query",
            name: "officeIds",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Query successfully",
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
}