import { Router } from "express";
import { create, getAll, remove, update } from "../controllers/category.controllers.js";
import { categorySchema } from "../schemas/category.schema.js";
import { validateWithZod } from "../middlewares/validateWithZod.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const categoryRoute = Router();

categoryRoute.post(
  "/",
  verifyToken,
  requireAdmin,
  validateWithZod(categorySchema),
  create
);
categoryRoute.get("/", getAll);
categoryRoute.put(
  "/:id",
  verifyToken,
  requireAdmin,
  validateWithZod(categorySchema),
  update
);
categoryRoute.delete("/:id", verifyToken, requireAdmin, remove);

export default categoryRoute;
