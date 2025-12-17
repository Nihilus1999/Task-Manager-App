import { check } from "express-validator";
import { validateResult } from "../helpers/handleValidator.js";
import { User } from "../models/User.js";

export const validateRegister = [
  check("email")
    .exists().withMessage("Se requiere el email")
    .isEmail().withMessage("Email inválido")
    .custom(async (value) => {
      const exists = await User.findOne({ where: { email: value } });
      if (exists) throw new Error("Ya existe un usuario con este email");
      return true;
    }),
  check("password")
    .exists().withMessage("Se requiere la contraseña")
    .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  (req, res, next) => validateResult(req, res, next)
];

export const validateLogin = [
  check("email")
    .exists().withMessage("Se requiere el email")
    .isEmail().withMessage("Email inválido"),
  check("password")
    .exists().withMessage("Se requiere la contraseña"),
  (req, res, next) => validateResult(req, res, next)
];
