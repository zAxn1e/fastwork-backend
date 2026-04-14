const asyncHandler = require("@/utils/asyncHandler");
const { sendSuccess } = require("@/utils/http");
const { requireEnum, requireNonEmptyString } = require("@/utils/validation");
const authService = require("@/services/auth.service");
const { sanitizeUser } = require("@/utils/sanitizeUser");
const { jwtExpiresIn } = require("@/config/env");
const { signAuthToken } = require("@/utils/jwt");

const ALLOWED_ROLES = ["CLIENT", "FREELANCER"];

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

  const token = signAuthToken(user.id);

  return sendSuccess(
    res,
    {
      user: sanitizeUser(user),
      auth: {
        tokenType: "Bearer",
        accessToken: token,
        expiresIn: jwtExpiresIn,
      },
    },
    201,
  );
});

const login = asyncHandler(async (req, res) => {
  const email = requireNonEmptyString(req.body.email, "email").toLowerCase();
  const password = validatePassword(req.body.password);

  const user = await authService.login(email, password);
  const token = signAuthToken(user.id);

  return sendSuccess(res, {
    user: sanitizeUser(user),
    auth: {
      tokenType: "Bearer",
      accessToken: token,
      expiresIn: jwtExpiresIn,
    },
  });
});

const logout = asyncHandler(async (req, res) => {
  return sendSuccess(res, { message: "Logged out successfully" });
});

const me = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.auth.userId);
  return sendSuccess(res, { user: sanitizeUser(user) });
});

module.exports = {
  register,
  login,
  logout,
  me,
};
