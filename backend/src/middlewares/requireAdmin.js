export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Yalnızca admin kullanıcılar bu işlemi yapabilir." });
  }
  next();
};