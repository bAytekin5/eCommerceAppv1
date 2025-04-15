export const validateWithZod = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    const message = err.errors?.[0]?.message || "Geçersiz veri gönderildi";
    return res.status(400).json({ message });
  }
};
