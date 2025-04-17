import { useNavigate } from "react-router-dom";
import useCartStore from "../store/cartStore";
import { Trash2 } from "lucide-react";

const Cart = () => {
  const { items, increaseQty, decreaseQty, removeFromCart, clearCart } =
    useCartStore();
  const navigate = useNavigate();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-white text-white p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Sepetim</h1>

        {items.length === 0 ? (
          <p className="text-gray-400">Sepetiniz boş.</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-700">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="py-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-400">
                      {item.price.toFixed(2)}₺
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="bg-gray-600 px-2 rounded text-white"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => increaseQty(item.id)}
                        className="bg-gray-600 px-2 rounded text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex justify-between items-center">
              <p className="text-lg font-semibold">
                Toplam: {total.toFixed(2)}₺
              </p>
              <div className="flex gap-4">
                <button
                  onClick={clearCart}
                  className="text-sm text-red-400 hover:underline"
                >
                  Sepeti Temizle
                </button>
                <button
                  onClick={() => navigate("/checkout")}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Ödemeye Geç
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
