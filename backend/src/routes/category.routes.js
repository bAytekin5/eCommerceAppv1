import { Router } from "express";
import { create, getAll } from "../controllers/category.controllers.js";
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

export default categoryRoute;
