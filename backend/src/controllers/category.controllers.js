import {
  createCategory,
  getAllCategories,
} from "../services/category.services.js";

/**
 * @route POST /api/categories
 * @desc Yeni kategori oluştur
 */
export const create = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Kategori adı zorunludur" });
    }

    const category = await createCategory({ name });
    res.status(201).json({
      message: "Kategori oluşturuldu",
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route GET /api/categories
 * @desc Tüm kategorileri getir
 */
export const getAll = async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};
