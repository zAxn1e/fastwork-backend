const express = require("express");
const path = require("path");
const fs = require("fs");
const swaggerUi = require("swagger-ui-express");
const { openApiSpec } = require("@/docs/openapi");
const {
    mediaBaseDir,
    frontendDocsEnabled,
    frontendDocsPath,
    frontendDocsDistDir,
    openApiServerUrls,
} = require("@/config/env");
const apiKeyAuth = require("@/middlewares/apiKeyAuth");
const notFound = require("@/middlewares/notFound");
const errorHandler = require("@/middlewares/errorHandler");
const authRoutes = require("@/routes/auth.routes");
const mediaRoutes = require("@/routes/media.routes");
const profileRoutes = require("@/routes/profile.routes");
const categoryRoutes = require("@/routes/category.routes");
const gigRoutes = require("@/routes/gig.routes");
const orderRoutes = require("@/routes/order.routes");
const reviewRoutes = require("@/routes/review.routes");
const adminRoutes = require("@/routes/admin.routes");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*",
  allowedHeaders: ["Content-Type", "x-api-key", "Authorization"],
}));
app.use(express.json());

const absoluteMediaDir = path.resolve(process.cwd(), mediaBaseDir);
const absoluteFrontendDocsDistDir = path.resolve(process.cwd(), frontendDocsDistDir);
fs.mkdirSync(path.join(absoluteMediaDir, "profiles"), { recursive: true });
fs.mkdirSync(path.join(absoluteMediaDir, "uploads"), { recursive: true });
fs.mkdirSync(path.join(absoluteMediaDir, "thumbnails"), { recursive: true });

app.use("/media", express.static(absoluteMediaDir));

if (frontendDocsEnabled) {
    if (fs.existsSync(absoluteFrontendDocsDistDir)) {
        app.use(frontendDocsPath, express.static(absoluteFrontendDocsDistDir));
    } else {
        app.get(frontendDocsPath, (_req, res) => {
            res.status(503).json({
                success: false,
                message: "Frontend docs build not found. Run `npm run docs:frontend:build` first.",
                data: {
                    expectedDir: absoluteFrontendDocsDistDir,
                },
            });
        });
    }
}

app.get("/openapi.json", (_req, res) => {
    res.json(openApiSpec);
});

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, {
        explorer: true,
        customSiteTitle: "Fastwork Mini Internal API Docs",
        swaggerOptions: {
            url: `${openApiServerUrls[0]}/openapi.json`,
        },
    }),
);

app.get("/health", (_req, res) => {
    res.json({
        success: true,
        data: {
            status: "ok",
            timestamp: new Date().toISOString(),
        },
    });
});

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/media-assets", mediaRoutes);

app.use(apiKeyAuth);

app.use("/categories", categoryRoutes);
app.use("/gigs", gigRoutes);
app.use("/orders", orderRoutes);
app.use("/reviews", reviewRoutes);
app.use("/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
