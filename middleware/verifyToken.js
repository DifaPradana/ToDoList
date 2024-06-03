import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // Dapatkan token dari header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).json({ message: "Unauthorized" });
  // Verifikasi token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      // Jika token expired
      if (err.name === "TokenExpiredError") {
        return res.status(403).json({ message: "token_expired" });
      }
      return res.status(403).json({ message: "Login needed!" });
    }
    req.id_user = decoded.id_user;
    next();
  });
};
