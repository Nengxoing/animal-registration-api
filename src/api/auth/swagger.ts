
export const AuthSwaggerDocs = {
  components: {
    schemas: {
      LoginResponse: {
        type: "object",
        properties: {
          phone: {
            type: "string",
            description: "User's phone number",
          },
          password: {
            type: "string",
            description: "User's password",
          },
        },
        description: "User details",
      },
    },
  },
  paths: {
    "/login": {
      post: {
        tags: ["Auths"],
        summary: "Login",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["phone", "password"],
                properties: {
                  username: {
                    type: "string",
                    description: "Phone",
                    example: "admin",
                  },
                  password: {
                    type: "string",
                    description: "Password",
                    example: "Lit@2024",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Logined successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" },
              },
            },
          },
        },
      },
    },
  },
};
