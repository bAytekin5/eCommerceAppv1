import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.log("Logout failed");
    }
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUser(null);
    toast.info("Çıkış yapıldı.");
    navigate("/login");
  };

  return (
    <header className="bg-black text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-white">
          eCommerce
        </Link>

        {/* Arama */}
        <div className="w-full max-w-md hidden md:block">
          <input
            type="text"
            placeholder="Ürün ara..."
            className="w-full px-4 py-2 border border-gray-700 rounded-xl text-sm bg-gray-900 text-white placeholder-gray-400"
          />
        </div>

        {/* Menü */}
        <div className="flex items-center gap-4 text-sm">
          <Link to="/products" className="hover:text-gray-300">
            Ürünler
          </Link>

          <Link to="/cart" className="relative">
            <ShoppingCart size={20} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              2
            </span>
          </Link>

          {loading ? null : user ? (
            <>
              <span className="hidden sm:inline text-gray-200">
                Merhaba, {user.firstName}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-xl text-sm transition"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">
                Giriş Yap
              </Link>
              <Link
                to="/register"
                className="bg-black text-white px-3 py-1 rounded-xl font-medium hover:bg-gray-200 transition"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
