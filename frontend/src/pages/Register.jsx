import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import bgImage from "../assets/bg.jpg";
import api from "../api/axios";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "İsim zorunludur"),
    lastName: z.string().min(1, "Soyisim zorunludur"),
    email: z.string().email("Geçerli bir e-posta girin"),
    password: z
      .string()
      .min(6, "Şifre en az 6 karakter olmalı")
      .regex(/[A-Z]/, "En az bir büyük harf içermeli")
      .regex(/[a-z]/, "En az bir küçük harf içermeli")
      .regex(/[0-9]/, "En az bir rakam içermeli"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler uyuşmuyor",
    path: ["confirmPassword"],
  });

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      registerSchema.parse(form);
    } catch (err) {
      setError(err.errors?.[0]?.message || "Form hatalı");
      return;
    }

    setIsLoading(true);

    try {
      const { firstName, lastName, email, password } = form;
      const res = await api.post("/auth/register", {
        firstName,
        lastName,
        email,
        password,
      });

      toast.success(" Kayıt başarılı! Giriş yapabilirsiniz.");
      navigate("/login");
    } catch (err) {
      const backendMessage = err.response?.data?.message;
      if (backendMessage?.includes("kayıtlı")) {
        setError("Bu e-posta zaten kayıtlı.");
      } else {
        setError(backendMessage || "Sunucu hatası.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white/30 backdrop-blur-md rounded-2xl shadow-lg border border-white/20">
        <div
          className="text-center mb-6 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
            eCommerce
          </h1>
          <p className="text-white text-sm mt-1">Yeni bir hesap oluştur</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded text-sm text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          {/* İsim */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="firstName"
              placeholder="Ad"
              value={form.firstName}
              onChange={handleChange}
              className="w-full pl-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Soyisim */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="lastName"
              placeholder="Soyad"
              value={form.lastName}
              onChange={handleChange}
              className="w-full pl-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* E-posta */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              placeholder="E-posta"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Şifre */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Şifre"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <span
              className="absolute right-3 top-3 text-gray-400 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {/* Şifre tekrar */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Şifre Tekrar"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Kaydediliyor..." : "Kayıt Ol"}
          </button>
        </form>

        <p className="text-center text-sm text-white mt-6">
          Zaten hesabınız var mı?{" "}
          <a href="/login" className="text-blue-200 font-medium underline">
            Giriş Yap
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
