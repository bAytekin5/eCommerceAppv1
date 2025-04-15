import { useState } from "react";
import { toast } from "react-toastify";
import { Mail } from "lucide-react";
import api from "../api/axios";
import bgImage from "../assets/bg.jpg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.includes("@")) {
      setError("Geçerli bir e-posta girin.");
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("📩 Şifre sıfırlama bağlantısı e-postanıza gönderildi.");
    } catch (err) {
      const msg = err.response?.data?.message || "Sunucu hatası";
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
          <h1 className="text-3xl font-bold text-white">Şifremi Unuttum</h1>
          <p className="text-white text-sm mt-1">
            E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 text-sm rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="E-posta adresiniz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Gönderiliyor..." : "Bağlantı Gönder"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
