import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/User.js";

dotenv.config();

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: passwordHash,
    });

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      data: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("register error:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      detail: error.parent?.message || error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRATION_TIME || "8h" }
    );

    return res.status(200).json({
      message: "Login exitoso",
      data: {
        id: user.id,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      detail: error.parent?.message || error.message,
    });
  }
};
