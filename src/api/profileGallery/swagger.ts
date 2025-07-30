export const ProfileGallerySwaggerDocs = {
  components: {
    schemas: {
      ProfileGallery: {
        type: "object",
        required: ["galleryId", "profileId"],
        properties: {
          galleryId: {
            type: "integer",
            example: 0,
            description: "Unique identifier of the gallery associated with the profile."
          },
          profileId: {
            type: "integer",
            example: 0,
            description: "Unique identifier of the profile associated with the gallery."
          }
        }
      }
    }
  },
  paths: {
    "/profile_gallery": {
      get: {
        tags: ["ProfileGallery"],
        summary: "Retrieve a list of profile-gallery relations.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: {
              type: "integer",
              minimum: 1,
            },
            description: "Page number for pagination. Default is 1."
          },
          {
            in: "query",
            name: "limit",
            schema: {
              type: "integer",
              minimum: 1,
            },
            description: "Number of records per page. Default is 10."
          },
          {
            in: "query",
            name: "search",
            schema: {
              type: "string",
            },
            description: "Search by partial match on profile's first name, last name, application number, and gallery name. Additionally, if the search term is numeric, it also searches for an exact match on the profile's barcode."
          }
        ],
        responses: {
          200: {
            description: "List of profile-gallery relations.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/ProfileGallery" }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["ProfileGallery"],
        summary: "Create a new profile-gallery relation.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProfileGallery" }
            }
          }
        },
        responses: {
          201: {
            description: "Profile-gallery relation successfully created.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProfileGallery" }
              }
            }
          }
        }
      }
    },
    "/profile_gallery/{id}": {
      get: {
        tags: ["ProfileGallery"],
        summary: "Retrieve a specific profile-gallery relation by ID.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
              example: 1
            },
            description: "Profile-gallery relation ID."
          }
        ],
        responses: {
          200: {
            description: "Profile-gallery relation details.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProfileGallery" }
              }
            }
          }
        }
      },
      put: {
        tags: ["ProfileGallery"],
        summary: "Update a profile-gallery relation by ID.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
              example: 1
            },
            description: "Profile-gallery relation ID."
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProfileGallery" }
            }
          }
        },
        responses: {
          200: {
            description: "Profile-gallery relation updated successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProfileGallery" }
              }
            }
          }
        }
      },
      delete: {
        tags: ["ProfileGallery"],
        summary: "Delete a profile-gallery relation by ID.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
              example: 1
            },
            description: "Profile-gallery relation ID."
          }
        ],
        responses: {
          204: {
            description: "Profile-gallery relation deleted successfully."
          }
        }
      }
    }
  }
};