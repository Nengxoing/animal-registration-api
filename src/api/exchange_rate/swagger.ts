
export const ExchangeRateSwaggerDocs = {
  components: {
    schemas: {
      ExchangeRate: {
        type: "object",
        required: ["baseCurrencyId", "targetCurrencyId", "rate", "startDate", "endDate", "type"],
        properties: {
          id: {
            type: "integer",
            example: 1,
            description: "Unique identifier for the exchange rate record."
          },
          baseCurrencyId: {
            type: "integer",
            example: 840,
            default: 840,
            description: "ID of the base currency (e.g., 840 for USD)."
          },
          targetCurrencyId: {
            type: "integer",
            example: 978,
            default: 978,
            description: "ID of the target currency (e.g., 978 for EUR)."
          },
          rateBase: {
            type: "number",
            format: "float",
            example: 1.12,
            default: 1.0,
            description: "Exchange rateBase between the base and target currency."
          },
          ratePolice: {
            type: "number",
            format: "float",
            example: 1.12,
            default: 1.0,
            description: "Exchange ratePolice between the base and target currency."
          },
          startDate: {
            type: "string",
            format: "date-time",
            example: "2023-01-01T00:00:00Z",
            description: "Start date of the exchange rate validity period."
          },
          endDate: {
            type: "string",
            format: "date-time",
            example: "2023-12-31T23:59:59Z",
            description: "End date of the exchange rate validity period."
          },
          type: {
            type: "string",
            example: "LIT",
            default: "LIT",
            description: "Type of exchange rate (e.g., LIT, POLICE)."
          },
          status: {
            type: "boolean",
            example: "true",
            default: true,
          }

        }
      }
    }
  },
  paths: {
    "/exchange_rate": {
      get: {
        tags: ["ExchangeRate"],
        summary: "Retrieve a list of exchange rates.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: {
              type: "integer",
              minimum: 1
            },
            description: "Page number for pagination."
          },
          {
            in: "query",
            name: "search",
            schema: {
              type: "string",
            },
          },
          {
            in: "query",
            name: "limit",
            schema: {
              type: "integer",
              minimum: 1
            },
            description: "Number of records per page."
          },
          {
            in: "query",
            name: "status",
            schema: {
              type: "boolean",
            },
            description: "Price status",
          },
        ],
        responses: {
          200: {
            description: "List of exchange rates.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/ExchangeRate" }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["ExchangeRate"],
        summary: "Create a new exchange rate record.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ExchangeRate" }
            }
          }
        },
        responses: {
          201: {
            description: "Exchange rate successfully created.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ExchangeRate" }
              }
            }
          }
        }
      }
    },
    "/exchange_rate/{id}": {
      get: {
        tags: ["ExchangeRate"],
        summary: "Retrieve a specific exchange rate by ID.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
              minimum: 1
            },
            description: "Exchange rate ID."
          }
        ],
        responses: {
          200: {
            description: "Exchange rate details.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ExchangeRate" }
              }
            }
          }
        }
      },
      put: {
        tags: ["ExchangeRate"],
        summary: "Update an exchange rate by ID.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
              minimum: 1
            },
            description: "Exchange rate ID."
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ExchangeRate" }
            }
          }
        },
        responses: {
          200: {
            description: "Exchange rate updated successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ExchangeRate" }
              }
            }
          }
        }
      },
      delete: {
        tags: ["ExchangeRate"],
        summary: "Delete an exchange rate by ID.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
              minimum: 1
            },
            description: "Exchange rate ID."
          }
        ],
        responses: {
          204: {
            description: "Exchange rate deleted successfully."
          }
        }
      }
    }
  }
};
