const prisma = require("@/lib/prisma");

async function listCategories() {
  return prisma.category.findMany({
    orderBy: { id: "asc" },
  });
}

async function createCategory(payload) {
  return prisma.category.create({
    data: {
      name: payload.name,
    },
  });
}

module.exports = {
  listCategories,
  createCategory,
};
