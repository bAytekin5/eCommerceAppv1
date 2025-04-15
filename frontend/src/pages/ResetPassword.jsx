import React from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import { Lock, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import bgImage from "../assets/bg.jpg";

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Şifre en az 6 karakter olmalı")
      .regex(/[A-Z]/, "En az bir büyük harf içermeli")
      .regex(/[a-z]/, "En az bir küçük harf içermeli")
      .regex(/[0-9]/, "En az bir sayı içermeli"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Şifreler eşleşmiyor",
  });

const ResetPassword = () => {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      passwordSchema.parse(form);
    } catch (err) {
      setError(err.errors?.[0]?.message || "Bir hata oluştu");
      return;
    }
    setIsLoading(true);
    try {
      await api.post("/auth/reset-password", {
        token: token,
        newPassword: form.password,
      });
      toast.success("Şifre başarıyla değiştirildi");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Bir hata oluştu";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md p-8 bg-white/30 backdrop-blur-md rounded-2xl shadow-lg border border-white/20">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">Şifre Sıfırlama</h1>
          <p className="text-white text-sm mt-1">Yeni şifrenizi belirleyin</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 text-sm rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Şifre alanı */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Yeni Şifre"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Şifre tekrar */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Yeni Şifre (Tekrar)"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <span
              className="absolute right-3 top-3 text-gray-400 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Kaydediliyor..." : "Şifreyi Sıfırla"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
