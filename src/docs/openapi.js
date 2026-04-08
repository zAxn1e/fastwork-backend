const { apiKeyRequired, port, sessionCookieName } = require("@/config/env");

const protectedSecurity = apiKeyRequired ? [{ ApiKeyAuth: [] }] : [];
const sessionSecurity = [{ SessionAuth: [] }];

const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Fastwork Mini Internal API",
    version: "1.0.0",
    description:
      "Internal API for mini freelance marketplace (Fastwork-like class project).",
  },
  servers: [{ url: `http://localhost:${port}` }],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Profile" },
    { name: "Media" },
    { name: "Categories" },
    { name: "Gigs" },
    { name: "Orders" },
    { name: "Reviews" },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-api-key",
        description: "Internal API key header",
      },
      SessionAuth: {
        type: "apiKey",
        in: "cookie",
        name: sessionCookieName,
        description: "Session cookie from login",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Unauthorized: invalid or missing x-api-key" },
        },
        required: ["success", "message"],
      },
      Category: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Web Development" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 2 },
          email: { type: "string", example: "freelancer1@internal.local" },
          displayName: { type: "string", example: "Narin Dev" },
          role: { type: "string", enum: ["CLIENT", "FREELANCER", "ADMIN"] },
          bio: { type: "string", nullable: true },
          profileImageUrl: { type: "string", nullable: true, example: "/media/profiles/abc.png" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Gig: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "Build Fastify REST API" },
          description: { type: "string", example: "Create scalable REST API with clean structure." },
          price: { type: "integer", example: 12000 },
          isActive: { type: "boolean", example: true },
          ownerId: { type: "integer", example: 2 },
          categoryId: { type: "integer", example: 1 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          owner: { $ref: "#/components/schemas/User" },
          category: { $ref: "#/components/schemas/Category" },
        },
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          message: { type: "string", nullable: true },
          agreedPrice: { type: "integer", example: 11500 },
          status: {
            type: "string",
            enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
            example: "PENDING",
          },
          gigId: { type: "integer", example: 1 },
          clientId: { type: "integer", example: 4 },
          sellerId: { type: "integer", example: 2 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          gig: { $ref: "#/components/schemas/Gig" },
          client: { $ref: "#/components/schemas/User" },
          seller: { $ref: "#/components/schemas/User" },
        },
      },
      Review: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
          comment: { type: "string", nullable: true, example: "Great work" },
          orderId: { type: "integer", example: 1 },
          gigId: { type: "integer", example: 1 },
          authorId: { type: "integer", example: 4 },
          targetUserId: { type: "integer", example: 2 },
          createdAt: { type: "string", format: "date-time" },
          order: { $ref: "#/components/schemas/Order" },
          gig: { $ref: "#/components/schemas/Gig" },
          author: { $ref: "#/components/schemas/User" },
          targetUser: { $ref: "#/components/schemas/User" },
        },
      },
      MediaAsset: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          ownerId: { type: "integer", example: 7 },
          originalName: { type: "string", example: "photo.png" },
          sourceMimeType: { type: "string", example: "image/png" },
          format: { type: "string", example: "webp" },
          width: { type: "integer", example: 1920 },
          height: { type: "integer", example: 1080 },
          sourceSizeBytes: { type: "integer", example: 453123 },
          webpSizeBytes: { type: "integer", example: 421000 },
          thumbnailSizeBytes: { type: "integer", example: 24300 },
          webpUrl: { type: "string", example: "/media/uploads/17111111-abc.webp" },
          thumbnailUrl: { type: "string", example: "/media/thumbnails/17111111-abc-thumb.webp" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      SuccessCategoryList: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Category" },
          },
        },
      },
      SuccessGigList: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Gig" },
          },
        },
      },
      SuccessOrderList: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Order" },
          },
        },
      },
      SuccessReviewList: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Review" },
          },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        security: [],
        responses: {
          200: {
            description: "Service is healthy",
            content: {
              "application/json": {
                example: {
                  success: true,
                  data: {
                    status: "ok",
                    timestamp: "2026-04-08T12:34:56.000Z",
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user and start session",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "displayName"],
                properties: {
                  email: { type: "string", example: "newuser@example.com" },
                  password: { type: "string", minLength: 6, example: "Password123!" },
                  displayName: { type: "string", example: "New User" },
                  role: { type: "string", enum: ["CLIENT", "FREELANCER", "ADMIN"], default: "CLIENT" },
                  bio: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Registered successfully",
          },
          409: {
            description: "Email already exists",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login and create session",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "client1@internal.local" },
                  password: { type: "string", example: "Password123!" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Logged in successfully",
          },
          401: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout current session",
        security: sessionSecurity,
        responses: {
          200: {
            description: "Logout success",
          },
          401: {
            description: "Not logged in",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current session user",
        security: sessionSecurity,
        responses: {
          200: {
            description: "Current user",
          },
          401: {
            description: "Not logged in",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/profile": {
      get: {
        tags: ["Profile"],
        summary: "Get my profile",
        security: sessionSecurity,
        responses: {
          200: {
            description: "Profile detail",
          },
        },
      },
      patch: {
        tags: ["Profile"],
        summary: "Update profile fields",
        security: sessionSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  displayName: { type: "string" },
                  bio: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Profile updated",
          },
        },
      },
    },
    "/profile/image": {
      post: {
        tags: ["Profile"],
        summary: "Upload profile image",
        security: sessionSecurity,
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["image"],
                properties: {
                  image: {
                    type: "string",
                    format: "binary",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Profile image uploaded",
          },
          400: {
            description: "Invalid file",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Profile"],
        summary: "Delete profile image",
        security: sessionSecurity,
        responses: {
          200: {
            description: "Profile image deleted",
          },
        },
      },
    },
    "/media-assets": {
      get: {
        tags: ["Media"],
        summary: "List my media assets",
        security: sessionSecurity,
        responses: {
          200: {
            description: "My media assets",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/MediaAsset" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/media-assets/upload": {
      post: {
        tags: ["Media"],
        summary: "Upload image media and auto convert to webp + thumbnail",
        security: sessionSecurity,
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file"],
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                    description: "Image file (jpeg/png/webp/gif/tiff)",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Uploaded and processed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/MediaAsset" },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid file",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/media-assets/{id}": {
      get: {
        tags: ["Media"],
        summary: "Get media asset by id",
        security: sessionSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer", minimum: 1 } }],
        responses: {
          200: {
            description: "Media asset detail",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/MediaAsset" },
                  },
                },
              },
            },
          },
          404: {
            description: "Media asset not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Media"],
        summary: "Delete media asset",
        security: sessionSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer", minimum: 1 } }],
        responses: {
          200: {
            description: "Deleted",
            content: {
              "application/json": {
                example: {
                  success: true,
                  data: {
                    message: "Media asset deleted",
                  },
                },
              },
            },
          },
        },
      },
    },
    "/categories": {
      get: {
        tags: ["Categories"],
        summary: "List categories",
        security: protectedSecurity,
        responses: {
          200: {
            description: "Category list",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessCategoryList" },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Categories"],
        summary: "Create category",
        security: protectedSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string", example: "Video Editing" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Category created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Category" },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/gigs": {
      get: {
        tags: ["Gigs"],
        summary: "List gigs",
        security: protectedSecurity,
        parameters: [
          { in: "query", name: "q", schema: { type: "string" }, description: "Search by title keyword" },
          { in: "query", name: "categoryId", schema: { type: "integer" } },
          { in: "query", name: "isActive", schema: { type: "boolean" } },
        ],
        responses: {
          200: {
            description: "Gig list",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessGigList" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Gigs"],
        summary: "Create gig",
        security: protectedSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "description", "price", "ownerId", "categoryId"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  price: { type: "integer", minimum: 1 },
                  ownerId: { type: "integer", minimum: 1 },
                  categoryId: { type: "integer", minimum: 1 },
                  isActive: { type: "boolean", default: true },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Gig created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/Gig" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/gigs/{id}": {
      get: {
        tags: ["Gigs"],
        summary: "Get gig by id",
        security: protectedSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer", minimum: 1 } }],
        responses: {
          200: {
            description: "Gig detail",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/Gig" },
                  },
                },
              },
            },
          },
          404: {
            description: "Gig not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Gigs"],
        summary: "Update gig",
        security: protectedSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer", minimum: 1 } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  price: { type: "integer", minimum: 1 },
                  ownerId: { type: "integer", minimum: 1 },
                  categoryId: { type: "integer", minimum: 1 },
                  isActive: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Gig updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/Gig" },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Gigs"],
        summary: "Delete gig",
        security: protectedSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer", minimum: 1 } }],
        responses: {
          200: {
            description: "Gig deleted",
            content: {
              "application/json": {
                example: {
                  success: true,
                  data: { message: "Gig deleted successfully" },
                },
              },
            },
          },
        },
      },
    },
    "/orders": {
      get: {
        tags: ["Orders"],
        summary: "List orders",
        security: protectedSecurity,
        parameters: [
          { in: "query", name: "clientId", schema: { type: "integer" } },
          { in: "query", name: "sellerId", schema: { type: "integer" } },
          {
            in: "query",
            name: "status",
            schema: { type: "string", enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"] },
          },
        ],
        responses: {
          200: {
            description: "Order list",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessOrderList" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Orders"],
        summary: "Create order from gig",
        security: protectedSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["gigId", "clientId"],
                properties: {
                  gigId: { type: "integer", minimum: 1 },
                  clientId: { type: "integer", minimum: 1 },
                  message: { type: "string" },
                  agreedPrice: { type: "integer", minimum: 1 },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Order created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/Order" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/orders/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Get order by id",
        security: protectedSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer", minimum: 1 } }],
        responses: {
          200: {
            description: "Order detail",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/Order" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/orders/{id}/status": {
      patch: {
        tags: ["Orders"],
        summary: "Update order status",
        security: protectedSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer", minimum: 1 } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: {
                    type: "string",
                    enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Order updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/Order" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/reviews": {
      get: {
        tags: ["Reviews"],
        summary: "List reviews",
        security: protectedSecurity,
        responses: {
          200: {
            description: "Review list",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessReviewList" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Reviews"],
        summary: "Create review",
        security: protectedSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["orderId", "authorId", "targetUserId", "rating"],
                properties: {
                  orderId: { type: "integer", minimum: 1 },
                  authorId: { type: "integer", minimum: 1 },
                  targetUserId: { type: "integer", minimum: 1 },
                  rating: { type: "integer", minimum: 1, maximum: 5 },
                  comment: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Review created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/Review" },
                  },
                },
              },
            },
          },
          409: {
            description: "Only one review per order",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/reviews/{id}": {
      get: {
        tags: ["Reviews"],
        summary: "Get review by id",
        security: protectedSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer", minimum: 1 } }],
        responses: {
          200: {
            description: "Review detail",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { $ref: "#/components/schemas/Review" },
                  },
                },
              },
            },
          },
          404: {
            description: "Review not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = {
  openApiSpec,
};
