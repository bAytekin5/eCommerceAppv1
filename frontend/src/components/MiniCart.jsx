import { useNavigate } from "react-router-dom";
import useCartStore from "../store/cartStore";
import { Trash2 } from "lucide-react";

const MiniCart = ({ onClose }) => {
  const { items, removeFromCart, increaseQty, decreaseQty, getTotalPrice } =
    useCartStore();

  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-sm text-gray-800 z-50">
        <p className="text-center text-gray-600">Sepetiniz boş.</p>
      </div>
    );
  }

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-sm text-gray-800 z-50">
      <h3 className="font-semibold mb-3 text-black">
        Sepetim ({items.length})
      </h3>

      <ul className="max-h-64 overflow-y-auto divide-y divide-gray-200">
        {items.map((item) => (
          <li key={item.id} className="py-3 flex gap-3 items-start">
            <img
              src={item.image || "https://via.placeholder.com/60"}
              alt={item.name}
              className="w-16 h-16 object-cover rounded border"
            />

            <div className="flex-1">
              <p className="font-semibold text-sm text-black">{item.name}</p>

              {/* Quantity Control */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded font-bold"
                >
                  -
                </button>
                <span className="min-w-[24px] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => increaseQty(item.id)}
                  className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded font-bold"
                >
                  +
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-1">
                {item.price.toFixed(2)}₺ x {item.quantity}
              </p>
            </div>

            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:text-red-700 mt-1"
              title="Sil"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>

      {/* Toplam ve Butonlar */}
      <div className="mt-4 text-sm font-semibold flex justify-between text-black">
        <span>Toplam:</span>
        <span>{getTotalPrice().toFixed(2)}₺</span>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => {
            onClose();
            navigate("/cart");
          }}
          className="hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
        >
          Sepete Git
        </button>
        <button
          onClick={() => {
            onClose();
            navigate("/checkout");
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
        >
          Ödeme
        </button>
      </div>
    </div>
  );
};

export default MiniCart;
