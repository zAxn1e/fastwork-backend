const { AppError } = require("@/utils/http");
const { verifyAuthToken } = require("@/utils/jwt");

function getBearerToken(authorizationHeader) {
  if (typeof authorizationHeader !== "string") {
    return null;
  }

  const [scheme, token] = authorizationHeader.trim().split(/\s+/);
  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}

function requireJwtAuth(req, _res, next) {
  const token = getBearerToken(req.headers.authorization);
  if (!token) {
    return next(new AppError(401, "Authentication required"));
  }

  try {
    const decoded = verifyAuthToken(token);
    const userId = Number(decoded.sub);
    if (!Number.isInteger(userId) || userId <= 0) {
      return next(new AppError(401, "Invalid authentication token"));
    }
    req.auth = { userId };
    return next();
  } catch (_error) {
    return next(new AppError(401, "Invalid or expired authentication token"));
  }
}

module.exports = requireJwtAuth;
