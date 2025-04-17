import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios.js";
import bgImage from "../../assets/bg.jpg";

const TwoFAVerify = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const userId = params.get("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (code.length !== 6 || isNaN(code)) {
      return setError("Lütfen 6 haneli geçerli bir kod girin.");
    }

    setIsLoading(true);

    try {
      const res = await api.post("/auth/verify-2fa", {
        userId: Number(userId),
        code,
      });
      localStorage.setItem("token", res.data.token);
      toast.success("Giriş başarılı!");
      navigate("/");
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
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white/30 backdrop-blur-md rounded-2xl shadow-lg border border-white/20">
        {/* Logo Başlık */}
        <div
          className="text-center mb-6 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
            eCommerce
          </h1>
          <p className="text-white text-sm mt-1">
            E-postanıza gelen 6 haneli kodu girin
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 text-sm rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Doğrulama Kodu"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 text-center text-lg tracking-widest"
            maxLength={6}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Doğrulanıyor..." : "Giriş Yap"}
          </button>
        </form>

        <p className="text-xs text-center text-white mt-6">
          Kod gelmediyse spam klasörünü kontrol edin ✉️
        </p>
      </div>
    </div>
  );
};

export default TwoFAVerify;
