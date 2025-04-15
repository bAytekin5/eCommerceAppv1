import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import Footer from "../components/Footer";
import bgImage from "../assets/bg.jpg";

const Home = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Kablosuz Kulaklık",
      price: 749.99,
      image: "https://picsum.photos/200/300?grayscale",
      rating: 4.5,
      badge: "Yeni",
      isFavorite: false,
    },
    {
      id: 2,
      name: "Akıllı Saat",
      price: 1299.0,
      image: "https://picsum.photos/200/300?grayscale",
      rating: 4.7,
      badge: "%30 İndirim",
      isFavorite: false,
    },
    {
      id: 3,
      name: "Bluetooth Hoparlör",
      price: 499.0,
      image: "https://picsum.photos/200/300?grayscale",
      rating: 4.4,
      badge: "Tükendi",
      isFavorite: false,
    },
  ]);

  const toggleFavorite = (id) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const categories = [
    "Elektronik",
    "Moda",
    "Ev",
    "Telefon",
    "Oyuncak",
    "Aksesuar",
    "Spor",
    "Giyim",
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div
        className="relative min-h-screen flex items-center justify-center text-center px-4"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-white max-w-2xl"
        >
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow">
            eMart’a Hoş Geldiniz
          </h1>
          <p className="text-lg mb-6 drop-shadow-sm">
            Uygun fiyatlarla kaliteli alışverişin keyfini çıkarın.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-white hover:bg-gray-100 text-black px-6 py-3 rounded-xl font-semibold text-lg flex items-center gap-2"
            onClick={() => navigate("/products")}
          >
            <ShoppingCart size={20} />
            Tüm Ürünleri Gör
          </motion.button>
        </motion.div>
      </div>

      {/* Kategoriler */}
      <div className="py-12 px-6 bg-gray-100">
        <motion.h2
          className="text-2xl font-bold text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Kategoriler
        </motion.h2>
        <div className="flex  gap-4 overflow-x-auto pb-4">
          {categories.map((cat, i) => (
            <motion.span
              key={i}
              whileHover={{ scale: 1.1 }}
              className="flex-shrink-0 px-5 py-2 bg-white text-gray-700 border rounded-full shadow hover:bg-blue-100 cursor-pointer"
            >
              {cat}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Ürünler */}
      <div className="bg-white py-12 px-6">
        <motion.h2
          className="text-3xl font-bold text-center mb-10 text-gray-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Popüler Ürünler
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <motion.div
              whileHover={{ scale: 1.03 }}
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden relative group"
            >
              {product.badge && (
                <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded z-10">
                  {product.badge}
                </span>
              )}

              {/* Kalp */}
              <button
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-2 right-2 z-10 bg-white p-1 rounded-full shadow hover:scale-110 transition"
              >
                {product.isFavorite ? (
                  <svg
                    className="h-5 w-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 5.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>

              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-blue-600 font-bold">
                  {product.price.toFixed(2)}₺
                </p>
                <div className="flex items-center text-yellow-500">
                  <Star size={16} />
                  <span className="ml-1">{product.rating}</span>
                </div>

                <div className="flex justify-between mt-4">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                    Sepete Ekle
                  </button>
                  <button
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Detay
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
