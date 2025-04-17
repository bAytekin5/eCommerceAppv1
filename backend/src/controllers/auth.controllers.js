import prisma from "../config/prisma.js";
import {
  forgotPasswordService,
  googleLoginService,
  loginUser,
  registerUser,
  resetPasswordService,
  verify2FACode,
} from "../services/auth.services.js";

export const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const response = await loginUser({ email, password });
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("acces_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Başarıyla çıkış yaptınız",
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    console.log(" Token'dan gelen kullanıcı:", req.user);

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      console.warn(" Kullanıcı bulunamadı.");
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    res.json(user);
  } catch (err) {
    console.error(" getMe hata:", err);
    next(err);
  }
};

export const googleLogin = async (req, res) => {
  try {
    const response = await googleLoginService(req.body.credential);
    res.status(200).json(response);
  } catch (err) {
    console.error("Google login error:", err);
    res
      .status(401)
      .json({ message: err.message || "Google oturumu başarısız." });
  }
};

export const verify2FA = async (req, res, next) => {
  try {
    const { userId, code } = req.body;
    const result = await verify2FACode({ userId, code });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await forgotPasswordService(email);
    res.status(200).json({
      message: "Şifre sıfırlama talimatları e-posta adresinize gönderildi.",
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    await resetPasswordService(token, newPassword);
    res.status(200).json({
      message: "Şifre başarıyla sıfırlandı.",
    });
  } catch (err) {
    next(err);
  }
};
