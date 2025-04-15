import prisma from "../config/prisma.js";
/**
 * Yeni bir kategori oluşturur
 * @param {Object} data
 * @param {string} data.name
 */
export const createCategory = async ({ name }) => {
  const existing = await prisma.category.findUnique({ where: { name } });
  if (existing) {
    throw new Error("Bu kategori zaten mevcut");
  }

  const category = await prisma.category.create({
    data: { name },
  });

  return category;
};

/**
 * Tüm kategorileri alfabetik sırada getir
 */
export const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
};
