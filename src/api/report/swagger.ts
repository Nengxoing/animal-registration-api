export const ReportSwaggerDocs = {
  components: {
    schemas: {
      Product: {
        type: "object",
      }
    }
  },
  paths: {
    "/application-aggregation": {
      get: {
        tags: ["Report"],
        summary: "Retrieve all applications with optional filters",
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
    "/application-stats": {
      get: {
        tags: ["Report"],
        summary: "Retrieve all applications with optional filters",
        parameters: [
          {
            in: "query",
            name: "officeId",
            schema: {
              type: "string",
            },
            description: "officeId",
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
                "FINISHED"
              ],
            },
            "description": "Select a status for filtering applications",
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
    "/total-revenue": {
      get: {
        tags: ["Report"],
        summary: "Retrieve all applications with optional filters",
        parameters: [
          {
            in: "query",
            name: "officeId",
            schema: {
              type: "string",
            },
            description: "officeId",
          },
          {
            in: "query",
            name: "paymentMethod",
            schema: {
              type: "string",
              enum: [
                "CASH",
                "MONEY_TRANSFER"
              ],
            },
            "description": "Select a paymentMethod for filtering applications",
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
    "/revenue-aggregation": {
      get: {
        tags: ["Report"],
        summary: "Retrieve all applications with optional filters",
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
    "/folder-refund-aggregation": {
      get: {
        tags: ["Report"],
        summary: "Retrieve all applications with optional filters",
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
    "/finance-aggregation": {
      get: {
        tags: ["Report"],
        summary: "Retrieve aggregated finance data filtered by office IDs and date range",
        description: "Returns aggregated finance data filtered by office IDs and a date range. The aggregation groups finance records by exchange rate and related currency details.",
        parameters: [
          {
            in: "query",
            name: "officeIds",
            schema: {
              type: "string"
            },
            required: true,
            example: "1,2,3",
            description: "A comma-separated list of office IDs to filter by."
          },
          {
            in: "query",
            name: "startDate",
            schema: {
              type: "string",
              format: "date"
            },
            required: true,
            example: "2025-01-01",
            description: "Start date for filtering finance records (YYYY-MM-DD)."
          },
          {
            in: "query",
            name: "endDate",
            schema: {
              type: "string",
              format: "date"
            },
            required: true,
            example: "2025-12-31",
            description: "End date for filtering finance records (YYYY-MM-DD)."
          }
        ],
        responses: {
          200: {
            description: "Aggregated finance data retrieved successfully.",
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
            description: "Internal server error."
          }
        }
      }
    },
    "/number-aggregation": {
      get: {
        tags: ["Report"],
        summary: "Retrieve aggregated finance data filtered by office IDs and date range",
        description: "Returns aggregated finance data filtered by office IDs and a date range. The aggregation groups finance records by exchange rate and related currency details.",
        parameters: [
          {
            in: "query",
            name: "officeIds",
            schema: {
              type: "string"
            },
            required: true,
            example: "1,2,3",
            description: "A comma-separated list of office IDs to filter by."
          },
          {
            in: "query",
            name: "createdAt",
            schema: {
              type: "string",
              format: "date"
            },
            required: true,
            example: "2025-01-01",
            description: "createdAt date for filtering finance records (YYYY-MM-DD)."
          },
        ],
        responses: {
          200: {
            description: "Aggregated finance data retrieved successfully.",
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
            description: "Internal server error."
          }
        }
      }
    }
  }
};


