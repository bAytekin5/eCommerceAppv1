import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import api from "../../api/axios.js";
import useCartStore from "../../store/cartStore"; 

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const { addToCart } = useCartStore(); 

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products", {
        params: Object.fromEntries([...searchParams]),
      });
      setProducts(res.data.data);
      setMeta({
        page: res.data.page,
        totalPages: res.data.totalPages,
      });
    } catch (err) {
      console.error("Ürünleri çekerken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Kategorileri çekerken hata:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const handleCategoryChange = (e) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value) {
      newParams.set("categoryId", e.target.value);
    } else {
      newParams.delete("categoryId");
    }
    newParams.set("page", 1);
    setSearchParams(newParams);
  };

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page);
    setSearchParams(newParams);
  };

  return (
    <div className="px-6 py-10 bg-gray-100 min-h-screen">
      {/* Kategori Filtresi */}
      <div className="flex justify-end mb-6">
        <select
          className="px-4 py-2 border border-gray-300 rounded-xl text-sm shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          onChange={handleCategoryChange}
          defaultValue={searchParams.get("categoryId") || ""}
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Ürün Listesi */}
      {loading ? (
        <p className="text-center text-gray-600">Yükleniyor...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-600">Ürün bulunamadı.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden relative"
            >
              {product.badge && (
                <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded">
                  {product.badge}
                </span>
              )}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                <p className="text-indigo-600 font-bold mb-2">
                  {product.price.toFixed(2)}₺
                </p>
                <div className="flex items-center gap-1 text-yellow-500 text-sm">
                  <Star size={16} />
                  <span>{product.rating}</span>
                </div>
                <button
                  onClick={() => addToCart(product)} 
                  className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-sm flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={16} /> Sepete Ekle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sayfalama */}
      <div className="mt-10 flex justify-center gap-2 flex-wrap">
        {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => handlePageChange(p)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
              meta.page === p
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
