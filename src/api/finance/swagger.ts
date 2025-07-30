export const FinanceSwaggerDocs = {
  paths: {
    "/finance": {
      post: {
        tags: ["Finances"],
        summary: "Create finance",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  receiptImage: {
                    type: "string",
                    format: "binary",
                    description: "Choose image",
                  },
                  folderId: {
                    type: "integer",
                    description: "Enter folder id",
                  },
                  amount: {
                    type: "integer",
                    description: "Amount",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateNewOffice" },
              },
            },
          },
        },
      },
      get: {
        tags: ["Finances"],
        summary: "Get all finances",
        security: [{ bearerAuth: [] }],
        parameters: [
  
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
  },
};