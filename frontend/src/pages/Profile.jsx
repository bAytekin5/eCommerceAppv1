import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import bgImage from "../assets/bg.jpg";
import { Eye, EyeOff, Lock } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      console.log("Token: ", token);

      if (!token) {
        toast.warning("Lütfen giriş yapınız.");
        return navigate("/login");
      }

      const res = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
    } catch (err) {
      toast.error("Oturum geçersiz. Lütfen tekrar giriş yapın.");
      navigate("/login");
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {}

    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    toast.info("Çıkış yapıldı.");
    navigate("/login");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Yeni şifre en az 6 karakter olmalı.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Şifreler uyuşmuyor.");
      return;
    }

    try {
      setIsLoading(true);
      await api.post(
        "/auth/change-password",
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || sessionStorage.getItem("token")
            }`,
          },
        }
      );
      toast.success("Şifre başarıyla değiştirildi.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg = err.response?.data?.message || "Sunucu hatası";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) return null;

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md p-8 bg-white/30 backdrop-blur-md rounded-2xl shadow-lg border border-white/20">
        <h1 className="text-3xl font-bold text-white text-center mb-4">
          Profil
        </h1>

        <div className="text-white space-y-2 text-center mb-6">
          <p>
            <span className="font-semibold">Ad Soyad:</span> {user.firstName}{" "}
            {user.lastName}
          </p>
          <p>
            <span className="font-semibold">E-posta:</span> {user.email}
          </p>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              placeholder="Yeni Şifre"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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

          <input
            type="password"
            placeholder="Şifre Tekrar"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            {isLoading ? "Değiştiriliyor..." : "Şifreyi Güncelle"}
          </button>
        </form>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
