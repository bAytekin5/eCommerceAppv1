import { Router } from "express";
import {
  create,
  getAll,
  getById,
  remove,
  update,
} from "../controllers/product.controllers.js";
import { validateProduct } from "../middlewares/product.validation.js";

const productRoute = Router();

productRoute.post("/", validateProduct, create);
productRoute.get("/", getAll);

productRoute.get("/:id", getById);
productRoute.put("/:id", validateProduct, update);
productRoute.delete("/:id", remove);

export default productRoute;
