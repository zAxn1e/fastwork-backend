const { apiKeyRequired, internalApiKey } = require("@/config/env");

function apiKeyAuth(req, res, next) {
  if (!apiKeyRequired) {
    return next();
  }

  if (!internalApiKey) {
    return res.status(500).json({
      success: false,
      message: "Server misconfiguration: INTERNAL_API_KEY is not set",
    });
  }

  const incomingApiKey = req.headers["x-api-key"];

  if (!incomingApiKey || incomingApiKey !== internalApiKey) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: invalid or missing x-api-key",
    });
  }

  return next();
}

module.exports = apiKeyAuth;
