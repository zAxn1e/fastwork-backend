require("dotenv").config();
require("module-alias/register");

const app = require("@/app");
const {
  port,
  frontendDocsEnabled,
  frontendDocsPath,
} = require("@/config/env");

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`API Docs running on http://localhost:${port}/docs`);
  if (frontendDocsEnabled) {
    console.log(`Frontend Docs running on http://localhost:${port}${frontendDocsPath}`);
  }
});
