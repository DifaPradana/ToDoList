import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    // Mencari pengguna berdasarkan refreshToken
    const user = await User.findOne({ where: { refreshToken: refreshToken } });
    if (!user) return res.sendStatus(403);

    // Verifikasi token refresh
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err) => {
      if (err) return res.sendStatus(403);

      // Jika verifikasi berhasil, buat access token baru
      const { id_user } = user;
      const accessToken = jwt.sign(
        { id_user },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
      );

      // Kirim access token ke client
      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
