const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-6 mt-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold mb-2">eCommerce</h3>
          <p>Kaliteli ürünleri en uygun fiyatlarla sunuyoruz.</p>
        </div>

        <div>
          <h3 className="font-bold mb-2">Bağlantılar</h3>
          <ul className="space-y-1 text-sm">
            <li className="hover:underline cursor-pointer">Hakkımızda</li>
            <li className="hover:underline cursor-pointer">İletişim</li>
            <li className="hover:underline cursor-pointer">Destek</li>
            <li className="hover:underline cursor-pointer">S.S.S.</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-2">Güvenli Alışveriş</h3>
          <div className="flex gap-4 items-center mt-2">
            <img src="/icons/visa.svg" alt="Visa" className="h-6" />
            <img src="/icons/mastercard.svg" alt="MasterCard" className="h-6" />
            <img src="/icons/iyzico.svg" alt="iyzico" className="h-6" />
          </div>
          <p className="text-sm mt-2"> Güvenli ödeme | 7 Gün iade</p>
        </div>
      </div>

      <p className="text-center text-xs mt-8">
        © {new Date().getFullYear()} eCommerce. Tüm hakları saklıdır.
      </p>
    </footer>
  );
};

export default Footer;
