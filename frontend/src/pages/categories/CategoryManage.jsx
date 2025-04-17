import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CategoryManage = () => {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const navigate = useNavigate();

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
        } else {
          fetchCategories();
        }
      })
      .catch(() => {
        toast.error("Giriş yapılmalı.");
        navigate("/login");
      });
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch {
      toast.error("Kategoriler yüklenemedi.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Kategori silindi.");
      fetchCategories();
    } catch {
      toast.error("Kategori silinemedi.");
    }
  };

  const handleUpdate = async (id) => {
    try {
      await api.put(`/categories/${id}`, { name: editName });
      toast.success("Kategori güncellendi.");
      setEditingId(null);
      fetchCategories();
    } catch {
      toast.error("Güncelleme başarısız.");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/categories", { name: newCategory });
      toast.success("Kategori eklendi.");
      setNewCategory("");
      fetchCategories();
    } catch {
      toast.error("Kategori eklenemedi.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">Kategori Yönetimi</h1>

      {/* Yeni Kategori Ekle */}
      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Yeni kategori adı"
          required
          className="flex-1 border px-4 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Ekle
        </button>
      </form>

      {/* Kategoriler Listesi */}
      <ul className="space-y-3">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="flex justify-between items-center border px-4 py-2 rounded"
          >
            {editingId === cat.id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 border px-2 py-1 rounded"
                />
                <button
                  onClick={() => handleUpdate(cat.id)}
                  className="text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 ml-2"
                >
                  Kaydet
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-sm text-gray-500 hover:text-black ml-2"
                >
                  İptal
                </button>
              </>
            ) : (
              <>
                <span className="flex-1">{cat.name}</span>
                <button
                  onClick={() => {
                    setEditingId(cat.id);
                    setEditName(cat.name);
                  }}
                  className="text-sm text-blue-600 hover:underline ml-2"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-sm text-red-600 hover:underline ml-2"
                >
                  Sil
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManage;
