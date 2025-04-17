import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";
import useCartStore from "../store/cartStore";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMiniCart, setShowMiniCart] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { items, removeFromCart, getTotalPrice } = useCartStore();

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

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
      .then((res) => setUser(res.data))
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
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center text-sm text-gray-800">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-gray-900 hover:opacity-80 transition"
        >
          eCommerce
        </Link>

        <div className="w-full max-w-md hidden md:block">
          <input
            type="text"
            placeholder="Ürün ara..."
            className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>

        <div className="flex items-center gap-4 relative">
          <Link
            to="/products"
            className="hover:text-black transition font-medium"
          >
            Ürünler
          </Link>

          {user?.role === "ADMIN" && (
            <Link
              to="/products/create"
              className="text-sm px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-black hover:text-white transition"
            >
              Ürün Ekle
            </Link>
          )}

          {/* Sepet İkonu ve MiniCart */}
          <div className="relative">
            <button onClick={() => setShowMiniCart((prev) => !prev)}>
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {showMiniCart && (
              <div className="absolute right-0 mt-3 w-80 bg-white shadow-lg border rounded-lg p-4 z-50 text-sm text-gray-700">
                <h4 className="font-semibold mb-2">Sepetim</h4>
                {items.length === 0 ? (
                  <p className="text-gray-500">Sepetiniz boş.</p>
                ) : (
                  <>
                    <ul className="max-h-60 overflow-y-auto divide-y">
                      {items.map((item) => (
                        <li key={item.id} className="py-2 flex justify-between">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              {item.quantity} x {item.price.toFixed(2)}₺
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex justify-between font-semibold">
                      <span>Toplam:</span>
                      <span>{getTotalPrice().toFixed(2)}₺</span>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setShowMiniCart(false);
                          navigate("/cart");
                        }}
                        className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
                      >
                        Sepete Git
                      </button>
                      <button
                        onClick={() => {
                          setShowMiniCart(false);
                          navigate("/checkout");
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                      >
                        Ödeme
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Kullanıcı Giriş Durumu */}
          {loading ? null : user ? (
            <>
              <span className="hidden sm:inline text-gray-600">
                Merhaba,{" "}
                <span className="font-semibold text-gray-800">
                  {user.firstName}
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-red-500 hover:text-white transition"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-black font-medium transition"
              >
                Giriş Yap
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 rounded-lg border border-gray-400 text-gray-800 hover:bg-black hover:text-white transition"
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
