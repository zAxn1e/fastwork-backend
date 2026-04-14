const prisma = require("@/lib/prisma");
const { AppError } = require("@/utils/http");

async function requireAdmin(req, _res, next) {
  if (!req.auth || !req.auth.userId) {
    return next(new AppError(401, "Authentication required"));
  }

  const user = await prisma.user.findUnique({
    where: { id: req.auth.userId },
    select: { role: true },
  });

  if (!user) {
    return next(new AppError(401, "Authentication required"));
  }

  if (user.role !== "ADMIN") {
    return next(new AppError(403, "Admin access required"));
  }

  return next();
}

module.exports = requireAdmin;
