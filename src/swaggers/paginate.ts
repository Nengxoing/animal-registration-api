export const PaginatedResponseSwaggerDocs = {
  components: {
    schemas: {
      PaginatedResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "ok" },
          message: { type: "string", example: "success" },
          meta: { $ref: "#/components/schemas/Meta" },
          result: {
            type: "array",
            items: {},
          },
        },
      },
      Meta: {
        type: "object",
        properties: {
          isFirstPage: { type: "boolean", example: true },
          isLastPage: { type: "boolean", example: true },
          currentPage: { type: "integer", example: 1 },
          previousPage: { type: "integer", nullable: true, example: null },
          nextPage: { type: "integer", nullable: true, example: null },
          pageCount: { type: "integer", example: 1 },
          totalCount: { type: "integer", example: 100 },
        },
      },
    },
  },
};
