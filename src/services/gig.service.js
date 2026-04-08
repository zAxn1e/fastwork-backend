const prisma = require("@/lib/prisma");
const { AppError } = require("@/utils/http");

function buildGigWhere(filters) {
  const where = {};

  if (filters.q) {
    where.title = {
      contains: filters.q,
      mode: "insensitive",
    };
  }

  if (filters.categoryId !== undefined) {
    where.categoryId = filters.categoryId;
  }

  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  return where;
}

async function createGig(payload) {
  return prisma.gig.create({
    data: payload,
    include: {
      owner: true,
      category: true,
    },
  });
}

async function listGigs(filters) {
  return prisma.gig.findMany({
    where: buildGigWhere(filters),
    include: {
      owner: true,
      category: true,
    },
    orderBy: { id: "desc" },
  });
}

async function getGigById(id) {
  const gig = await prisma.gig.findUnique({
    where: { id },
    include: {
      owner: true,
      category: true,
    },
  });

  if (!gig) {
    throw new AppError(404, "Gig not found");
  }

  return gig;
}

async function updateGig(id, payload) {
  await getGigById(id);

  return prisma.gig.update({
    where: { id },
    data: payload,
    include: {
      owner: true,
      category: true,
    },
  });
}

async function deleteGig(id) {
  await getGigById(id);
  await prisma.gig.delete({ where: { id } });
}

module.exports = {
  createGig,
  listGigs,
  getGigById,
  updateGig,
  deleteGig,
};
