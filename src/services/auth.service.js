const bcrypt = require("bcrypt");
const prisma = require("@/lib/prisma");
const { AppError } = require("@/utils/http");

async function register(payload) {
  const existing = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existing) {
    throw new AppError(409, "Email is already in use");
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);

  return prisma.user.create({
    data: {
      email: payload.email,
      passwordHash,
      displayName: payload.displayName,
      role: payload.role || "CLIENT",
      bio: payload.bio,
    },
  });
}

async function login(email, password) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const matched = await bcrypt.compare(password, user.passwordHash);
  if (!matched) {
    throw new AppError(401, "Invalid email or password");
  }

  return user;
}

async function getMe(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user;
}

module.exports = {
  register,
  login,
  getMe,
};
