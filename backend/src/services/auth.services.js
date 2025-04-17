import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { OAuth2Client } from "google-auth-library";
import { send2FACode } from "../utils/send2FACode.js";
import dayjs from "dayjs";
import { sendResetPasswordEmail } from "../utils/sendResetPasswordEmail.js";

const JWT_SECRET = process.env.JWT_SECRET;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const registerUser = async ({
  firstName,
  lastName,
  email,
  password,
}) => {
  if (!firstName || !lastName || !email || !password) {
    throw new Error("Tüm alanlar zorunludur...");
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error(
      "Şifre en az 6 karakter, büyük harf, küçük harf ve sayı içermelidir."
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Bu e-posta zaten kayıtlı.");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    },
  });

  return {
    message: "Kayıt Başarılı",
    user: {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
    },
  };
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) throw new Error("Email ve şifre zorunludur!");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Kullanıcı Bulunamadı...");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Şifre yanlış");

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      twoFACode: code,
      twoFAExpiresAt: dayjs().add(5, "minute").toDate(),
    },
  });

  await send2FACode(user.email, code);

  return {
    message: "2FA kodu e-posta ile gönderildi.",
    userId: user.id,
  };
};

export const googleLoginService = async (credential) => {
  if (!credential) {
    throw new Error("Google token eksik.");
  }

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { email, name } = payload;

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: name || "Google Kullanıcısı",
        password: "google-oauth",
      },
    });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token, message: "Google ile giriş başarılı." };
};

export const verify2FACode = async ({ userId, code }) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
  });

  if (!user) throw new Error("Kullanıcı bulunamadı.");
  if (!user.twoFACode || !user.twoFAExpiresAt)
    throw new Error("Doğrulama kodu yok.");

  const isExpired = dayjs().isAfter(user.twoFAExpiresAt);
  if (isExpired) throw new Error("Kodun süresi doldu.");
  if (user.twoFACode !== code) throw new Error("Kod hatalı.");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      twoFACode: null,
      twoFAExpiresAt: null,
    },
  });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    message: "Giriş başarılı",
    token,
  };
};

export const forgotPasswordService = async (email) => {
  if (!email) throw new Error("Email zorunludur.");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Kullanıcı bulunamadı.");

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "15m",
  });

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await sendResetPasswordEmail(email, resetLink);
};

export const resetPasswordService = async (token, newPassword) => {
  if (!token || !newPassword) {
    throw new Error("Yeni şifre zorunludur.");
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Token geçersiz veya süresi dolmuş.");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user) throw new Error("Kullanıcı bulunamadı.");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });
};
