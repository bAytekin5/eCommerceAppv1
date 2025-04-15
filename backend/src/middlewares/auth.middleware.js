import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(" Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn(" Token eksik veya Bearer başlamadı.");
    return res.status(403).json({ message: "Token eksik" });
  }

  const token = authHeader.split(" ")[1];
  console.log(" Ayrıştırılan Token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("JWT doğrulandı. Kullanıcı ID:", decoded.id);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(" JWT doğrulama hatası:", err.message);
    return res.status(401).json({ message: "Token geçersiz" });
  }
};
