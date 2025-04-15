export const validateProduct = (req, res, next) => {
    const { name, description, price, stock, categoryId } = req.body;
  
    if (!name || !description || !price || !stock || !categoryId) {
      return res.status(400).json({ message: "Tüm alanlar zorunludur" });
    }
  
    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({ message: "Geçerli bir fiyat giriniz" });
    }
  
    if (typeof stock !== "number" || stock < 0) {
      return res.status(400).json({ message: "Geçerli bir stok miktarı giriniz" });
    }
  
    if (typeof categoryId !== "number" || categoryId < 1) {
      return res.status(400).json({ message: "Geçerli bir kategori seçiniz" });
    }
  
    next(); 
  };
  