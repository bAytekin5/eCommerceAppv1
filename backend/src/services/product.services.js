import prisma from "../config/prisma.js";
export const createProduct = async (data) => {
  const { name, description, price, stock, categoryId, image } = data;

  if (!categoryId) {
    throw new Error("categoryId alanı eksik!");
  }

  const category = await prisma.category.findUnique({
    where: { id: parseInt(categoryId) },
  });

  if (!category) throw new Error("Kategori bulunamadı");

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      categoryId: parseInt(categoryId),
      image,
    },
  });

  return product;
};

export const getAllProducts = async (query) => {
  const { page = 1, limit = 10, categoryId, search } = query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {};

  if (categoryId) {
    where.categoryId = parseInt(categoryId);
  }

  if (search) {
    where.name = {
      contains: search,
      mode: 'insensitive', 
    };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      skip,
      take: parseInt(limit),
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data: products,
    total,
    page: parseInt(page),
    pageSize: parseInt(limit),
    totalPages: Math.ceil(total / parseInt(limit)),
  };
};


export const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: {
      category: true,
    },
  });
  if (!product) throw new Error("Ürün bulunamadı");
  return product;
};

export const updateProduct = async (id, data) => {
  const product = await prisma.product.update({
    where: { id: parseInt(id) },
    data,
  });
  return product;
};

export const deleteProduct = async (id) => {
  await prisma.product.delete({
    where: { id: parseInt(id) },
  });
  return { message: "Ürün silindi" };
};
