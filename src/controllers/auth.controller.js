const asyncHandler = require("@/utils/asyncHandler");
const { AppError, sendSuccess } = require("@/utils/http");
const { requireEnum, requireNonEmptyString } = require("@/utils/validation");
const authService = require("@/services/auth.service");
const { sanitizeUser } = require("@/utils/sanitizeUser");
const { sessionCookieName } = require("@/config/env");

const ALLOWED_ROLES = ["CLIENT", "FREELANCER", "ADMIN"];

function validatePassword(password) {
  const value = requireNonEmptyString(password, "password");
  if (value.length < 6) {
    throw new AppError(400, "password must be at least 6 characters");
  }
  return value;
}

const register = asyncHandler(async (req, res) => {
  const email = requireNonEmptyString(req.body.email, "email").toLowerCase();
  const password = validatePassword(req.body.password);
  const displayName = requireNonEmptyString(req.body.displayName, "displayName");
  const role =
    req.body.role !== undefined
      ? requireEnum(req.body.role, "role", ALLOWED_ROLES)
      : "CLIENT";
  const bio =
    req.body.bio !== undefined ? requireNonEmptyString(req.body.bio, "bio") : undefined;

  const user = await authService.register({
    email,
    password,
    displayName,
    role,
    bio,
  });

  req.session.userId = user.id;

  return sendSuccess(
    res,
    {
      user: sanitizeUser(user),
      session: { userId: user.id },
    },
    201,
  );
});

const login = asyncHandler(async (req, res) => {
  const email = requireNonEmptyString(req.body.email, "email").toLowerCase();
  const password = validatePassword(req.body.password);

  const user = await authService.login(email, password);
  req.session.userId = user.id;

  return sendSuccess(res, {
    user: sanitizeUser(user),
    session: { userId: user.id },
  });
});

const logout = asyncHandler(async (req, res) => {
  await new Promise((resolve, reject) => {
    req.session.destroy((error) => {
      if (error) {
        reject(new AppError(500, "Failed to logout"));
        return;
      }
      resolve();
    });
  });

  res.clearCookie(sessionCookieName);
  return sendSuccess(res, { message: "Logged out successfully" });
});

const me = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.session.userId);
  return sendSuccess(res, { user: sanitizeUser(user) });
});

module.exports = {
  register,
  login,
  logout,
  me,
};
