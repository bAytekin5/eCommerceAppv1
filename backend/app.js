import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoute from "./src/routes/auth.routes.js";
import productRoute from "./src/routes/product.routes.js";
import categoryRoute from "./src/routes/category.routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/categories", categoryRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || "Bir hata oluştu",
  });
});
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} portunda çalışıyor...`);
});
