const { AppError } = require("@/utils/http");

function requireSessionAuth(req, _res, next) {
  if (!req.session || !req.session.userId) {
    return next(new AppError(401, "Authentication required"));
  }

  return next();
}

module.exports = requireSessionAuth;
