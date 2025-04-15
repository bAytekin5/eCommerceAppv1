import expres from "express";
import {
  forgotPassword,
  getMe,
  googleLogin,
  login,
  logout,
  register,
  resetPassword,
  verify2FA,
} from "../controllers/auth.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const authRoute = expres.Router();

authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.post("/google-login", googleLogin);
authRoute.post("/verify-2FA", verify2FA);
authRoute.post("/logout", logout);
authRoute.get("/me", verifyToken, getMe);

authRoute.post("/forgot-password", forgotPassword);
authRoute.post("/reset-password", resetPassword);
export default authRoute;
