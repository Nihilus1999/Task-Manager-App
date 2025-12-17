export const errorMiddleware = (err, req, res, next) => {
  console.error("Global error:", err);
  return res.status(500).json({ message: "Error interno del servidor" });
};
