import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { toast } from "react-toastify";

const ProductCreate = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    image: "",
    badge: "",
  });

  // Kategorileri getir
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      toast.error("Kategoriler yüklenemedi.");
    }
  };

  // Admin kontrolü
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) return navigate("/login");

    api
      .get("/auth/me")
      .then((res) => {
        if (res.data.role !== "ADMIN") {
          toast.error("Bu sayfaya erişim yetkiniz yok.");
          navigate("/");
        }
      })
      .catch(() => {
        toast.error("Bir hata oluştu.");
        navigate("/login");
      });

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/products", {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        categoryId: parseInt(form.categoryId),
      });

      toast.success("Ürün başarıyla eklendi!");
      navigate("/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Ürün eklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-xl shadow border">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Yeni Ürün Ekle</h1>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm text-gray-700">
        <input
          type="text"
          name="name"
          placeholder="Ürün adı"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded outline-none focus:ring focus:ring-indigo-200"
        />

        <textarea
          name="description"
          placeholder="Açıklama"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded outline-none focus:ring focus:ring-indigo-200"
        />

        <input
          type="number"
          name="price"
          placeholder="Fiyat"
          value={form.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="w-full border px-4 py-2 rounded outline-none focus:ring focus:ring-indigo-200"
        />

        <input
          type="number"
          name="stock"
          placeholder="Stok adedi"
          value={form.stock}
          onChange={handleChange}
          required
          min="0"
          className="w-full border px-4 py-2 rounded outline-none focus:ring focus:ring-indigo-200"
        />

        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded outline-none focus:ring focus:ring-indigo-200"
        >
          <option value="">Kategori seçin</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="image"
          placeholder="Görsel URL"
          value={form.image}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded outline-none focus:ring focus:ring-indigo-200"
        />

        <input
          type="text"
          name="badge"
          placeholder="Etiket (isteğe bağlı)"
          value={form.badge}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded outline-none focus:ring focus:ring-indigo-200"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          {loading ? "Ekleniyor..." : "Ürünü Ekle"}
        </button>
      </form>
    </div>
  );
};

export default ProductCreate;
