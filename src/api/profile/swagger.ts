/* eslint-disable max-lines */

import { Gender } from "@prisma/client";


export const ProfileSwaggerDocs = {
  components: {
    schemas: {
      Profile: {
        type: "object",
        required: ["id", "name"],
        properties: {
          id: {
            type: "integer",
            description: "Profile ID",
          },
          name: {
            type: "string",
            description: "Profile name",
          },
          image: {
            type: "string",
            nullable: true,
            description: "Profile image URL",
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
    "/profile": {
      post: {
        tags: ["Profiles"],
        summary: "Create a new profile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  firstName: {
                    type: "string",
                    description: "Profile first name",
                    example: "Meng",
                  },
                  lastName: {
                    type: "string",
                    description: "Profile last name",
                    example: "Moua",
                  },
                  image: {
                    type: "string",
                    format: "binary",
                    description: "Profile image file (new image)",
                  },
                  oldImage: {
                    type: "string",
                    format: "binary",
                    description: "Profile image file (new image)",
                  },
                 
                  gender: {
                    type: "string",
                    description: "Profile gender",
                    example: "Female",
                  },
                  applicationNumber: {
                    type: "string",
                    description: "Profile application number",
                    example: "123456789",
                  },
                  age: {
                    type: "Integer",
                    description: "Profile age",
                    example: 2,
                  },
                  weight: {
                    type: "integer",
                    description: "Profile weight in kg",
                    example: 20,
                  },
                  height: {
                    type: "integer",
                    description: "Profile height in cm",
                    example: 50,
                  },
                  breed: {
                    type: "string",
                    description: "Profile breed",
                    example: "Lao breed",
                  },
                 
                },
                
              },
            },
          },
        },
        responses: {
          201: {
            description: "Profile created successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Profile",
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
        tags: ["Profiles"],
        summary: "Get all profiles",
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
            name: "barcode",
            schema: {
              type: "integer",
              minimum: 1,
            },
            description: "barcode number",
          },
          {
            in: "query",
            name: "gender",
            schema: {
              type: "string",
              enum: Object.values(Gender),
            },
            description: "Filter profiles by gender",
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
        ],
        responses: {
          200: {
            description: "List of profiles",
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
    "/profile-log": {
      get: {
        tags: ["Profiles"],
        summary: "Get profile logs",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "profileId",
            schema: {
              type: "integer",
            },
            description: "Filter logs by profile ID",
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
            example: 1,
            schema: {
              type: "integer",
            },
            description: "Enter page number here",
          },
          {
            in: "query",
            name: "limit",
            example: 10,
            schema: {
              type: "integer",
            },
            description: "Enter number of items per page here",
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
    "/profile/{id}": {
      get: {
        tags: ["Profiles"],
        summary: "Get profile by ID",
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
            description: "Profile id",
          },
        ],
        responses: {
          200: {
            description: "Query successfully",
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
        tags: ["Profiles"],
        summary: "Edit profile by ID",
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
            description: "Profile id",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  firstName: {
                    type: "string",
                    description: "Profile first name",
                    example: "Meng",
                  },
                  lastName: {
                    type: "string",
                    description: "Profile last name",
                    example: "Moua",
                  },
                  image: {
                    type: "string",
                    format: "binary",
                    description: "Profile image file",
                  },
                  phoneNumber: {
                    type: "string",
                    description: "Profile phone number",
                    example: "",
                  },
                  dateOfBirth: {
                    type: "string",
                    format: "date",
                    example: "2025-01-01T00:00:00.000Z",
                    description: "Date of birth",
                  },
                  gender: {
                    type: "string",
                    description: "Profile gender",
                    example: "Female",
                  },
                  nationalityId: {
                    type: "integer",
                    description: "Nationality id",
                    example: 3,
                  },
                  ethnicityId: {
                    type: "integer",
                    description: "Ethnicity id",
                    example: 3,
                  },
                  identityType: {
                    type: "string",
                    description: "Identity type",
                    example: "Passport",
                  },
                  identityNumber: {
                    type: "string",
                    description: "Identity number",
                    example: "25461325",
                  },
                  identityIssueDate: {
                    type: "string",
                    format: "date",
                    example: "2025-01-01T00:00:00.000Z",
                    description: "Identity issue date",
                  },
                  identityExpiryDate: {
                    type: "string",
                    format: "date",
                    example: "2025-01-01T00:00:00.000Z",
                    description: "Identity expiry date",
                  },
                  currentProvince: {
                    type: "integer",
                    example: 1,
                    description: "Current province id",
                  },
                  currentDistrict: {
                    type: "integer",
                    example: 1,
                    description: "Current district id",
                  },
                  currentVillage: {
                    type: "string",
                    example: "Nongphaya",
                    description: "Current village",
                  },
                  overseasProvince: {
                    type: "string",
                    example: "Vientiane capital",
                    description: "Overseas province",
                  },
                  overseasDistrict: {
                    type: "string",
                    example: "Nongphaya",
                    description: "Overseas district",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Edit successfully",
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
    "/profile-aggregation": {
      get: {
        tags: ["Profiles"],
        summary: "Get profile aggregation",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "start",
            schema: {
              type: "string",
              default: "2025-01-05",
              minimum: 1,
            },
            description: "Start number",
          },
          {
            in: "query",
            name: "end",
            schema: {
              type: "string",
              default: "2025-01-11",
              minimum: 1,
            },
            description: "End number",
          },
          {
            in: "query",
            name: "officeId",
            schema: {
              type: "integer",
              minimum: 1,
            },
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
    "/profile-barcode": {
      get: {
        tags: ["Profiles"],
        summary: "Get profile aggregation",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "barcode",
            schema: {
              type: "number",
              minimum: 1,
            },
            description: "barcode by first name or last name",
          },
          {
            in: "query",
            name: "search",
            schema: {
              type: "string",
              minimum: 1,
            },
            description: "search by first name or last name",
          },
        ],
        responses: {
          404: {
            description: "Not found",
          },
          500: {
            description: "Server internal error",
          },
        },
      },
    },
    "/profile-chart": {
      get: {
        tags: ["Profiles"],
        summary: "Get profile aggregation chart",
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
        ],
        responses: {
          200: {
            description: "Chart details",
          },
        },
      },
    },
  },
}