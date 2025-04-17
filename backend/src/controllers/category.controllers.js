import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
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

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Kategori adı zorunludur" });
    }

    const category = await updateCategory(id, { name });
    res.status(200).json({
      message: "Kategori güncellendi",
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    await deleteCategory(id);
    res.status(200).json({ message: "Kategori silindi" });
  } catch (err) {
    next(err);
  }
};
