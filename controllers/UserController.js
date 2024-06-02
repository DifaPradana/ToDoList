import argon2d, { hash } from "argon2";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import responses from "../response.js";
import { refreshToken } from "../middleware/refreshToken.js";

export const createUser = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Password tidak cocok" });
  }

  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) {
    return res.status(400).json({ message: "Email sudah digunakan" });
  }
  const existingUsername = await User.findOne({ where: { username } });
  if (existingUsername) {
    return res.status(400).json({ message: "Username sudah digunakan" });
  }

  const hashPassword = await argon2d.hash(password);
  try {
    const user = await User.create({
      username,
      email,
      password: hashPassword,
    });
    return res.status(201).json({ message: "User berhasil dibuat" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const Login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const validPassword = await argon2d.verify(
      user.password,
      req.body.password
    );
    if (!validPassword)
      return res.status(400).json({ message: "Password salah!" });

    // Password Correct

    // Generate JWT token
    const { id_user } = user; // Destructure user data
    const accessToken = jwt.sign(
      { id_user }, // Include all relevant user data
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" } // Adjust the expiration time as needed
    );

    const refreshToken = jwt.sign(
      {
        user: {
          id_user: user.id_user,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" } // Adjust the expiration time as needed
    );

    await User.update(
      { refreshToken: refreshToken },
      { where: { id_user: user.id_user } }
    );

    // req.session.id_user = user.id_user;

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24, // 1 day in milliseconds
    });
    return res.status(200).json({
      status_code: 200,
      message: "Login successfully",
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  try {
    const user = await User.findOne({ where: { refreshToken: refreshToken } });
    if (!user) return res.sendStatus(204);

    await User.update(
      { refreshToken: null },
      { where: { id_user: user.id_user } }
    );
    res.clearCookie("refreshToken");
    return responses(200, null, "Logout successfully", res);
  } catch (error) {
    console.error("Error during logout:", error);
    return res.sendStatus(500);
  }
};

export const ViewLogin = (req, res) => {
  res.render("auth-login");
};

export const ViewRegister = (req, res) => {
  res.render("auth-register");
};
