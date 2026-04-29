const asyncHandler = require("@/utils/asyncHandler");
const { AppError, sendSuccess } = require("@/utils/http");
const {
  requireDate,
  requireEnum,
  requireNonEmptyString,
  requireStringArray,
} = require("@/utils/validation");
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
  const firstName = requireNonEmptyString(
    req.body.firstname ?? req.body.firstName,
    "firstname",
  );
  const lastName = requireNonEmptyString(
    req.body.lastname ?? req.body.lastName,
    "lastname",
  );
  const birthday = requireDate(req.body.birthday, "birthday");
  const telephoneNumber = requireNonEmptyString(
    req.body.telephoneNumber ?? req.body.telephone ?? req.body.phoneNumber,
    "telephoneNumber",
  );
  const skills = requireStringArray(req.body.skills, "skills", 1);
  const role =
    req.body.role !== undefined
      ? requireEnum(req.body.role, "role", ALLOWED_ROLES)
      : "CLIENT";
  const bio =
    req.body.bio === undefined ||
    (typeof req.body.bio === "string" && req.body.bio.trim() === "")
      ? "No bio yet."
      : requireNonEmptyString(req.body.bio, "bio");
  const user = await authService.register({
    email,
    password,
    firstName,
    lastName,
    birthday,
    telephoneNumber,
    skills,
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
