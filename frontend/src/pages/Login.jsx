import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { GoogleLogin } from "@react-oauth/google";
import bgImage from "../assets/bg.jpg";

const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin."),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı."),
});

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      loginSchema.parse(form);
    } catch (err) {
      setError(err.errors?.[0]?.message || "Form hatalı");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      console.log("Login cevabı:", res.data); 

      const { token, userId } = res.data;

      if (token) {
        rememberMe
          ? localStorage.setItem("token", token)
          : sessionStorage.setItem("token", token);

        toast.success("🎉 Giriş başarılı!");
        navigate("/");
      } else if (userId) {
        toast.info("📩 2FA kodu e-posta ile gönderildi");
        navigate(`/verify-2fa?userId=${userId}`);
      } else {
        setError("Beklenmeyen sunucu cevabı.");
      }
    } catch (err) {
      const backendMessage = err.response?.data?.message;

      if (backendMessage === "Kullanıcı bulunamadı") {
        setError("Bu e-posta adresine ait kullanıcı yok.");
      } else if (backendMessage === "Şifre hatalı") {
        setError("Şifre hatalı.");
      } else {
        setError(backendMessage || "Sunucuya ulaşılamıyor.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bgImage})` }}
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
          <p className="text-white text-sm mt-1">Hesabınıza giriş yapın</p>
        </div>

        <div className="text-center mt-4">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              api
                .post("/auth/google-login", {
                  credential: credentialResponse.credential,
                })
                .then((res) => {
                  const token = res.data.token;
                  if (token) {
                    localStorage.setItem("token", token);
                    toast.success("Google ile giriş başarılı!");
                    navigate("/");
                  } else {
                    toast.error("Google oturumu başarısız.");
                  }
                })
                .catch(() => toast.error("Google girişi başarısız."));
            }}
            onError={() => toast.error("Google oturumu başlatılamadı.")}
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400 my-6">
          <hr className="flex-grow border-gray-300" />
          <span>veya</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded text-sm text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              placeholder="E-posta"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Şifre"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
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

          <div className="flex items-center gap-2 text-sm text-white">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={() => setRememberMe((prev) => !prev)}
              className="accent-blue-600 cursor-pointer"
            />
            <label htmlFor="remember" className="cursor-pointer">
              Beni Hatırla
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition ${
              isLoading && "opacity-50 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            ) : (
              "Giriş Yap"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-white mt-3">
          Şifrenizi mi unuttunuz?{" "}
          <a href="/forgot-password" className="text-blue-200 underline">
            Sıfırla
          </a>
        </p>
        <p className="text-center text-sm text-white mt-6">
          Hesabınız yok mu?{" "}
          <a href="/register" className="text-blue-200 font-medium underline">
            Kayıt Ol
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
