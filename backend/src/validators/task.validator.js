import { check, param } from "express-validator";
import { validateResult } from "../helpers/handleValidator.js";
import { validate as validateUUID } from "uuid";

const allowedStatus = ["pendiente", "en progreso", "completada"];
const allowedPriority = ["baja", "media", "alta"];

export const validateTaskId = [
  param("id").custom((value) => {
    if (!validateUUID(value))
      throw new Error("El id de la tarea debe ser UUID");
    return true;
  }),
  (req, res, next) => validateResult(req, res, next),
];

export const validateTaskCreate = [
  check("title")
    .exists()
    .withMessage("Se requiere el título")
    .notEmpty()
    .withMessage("El título no puede estar vacío")
    .isLength({ max: 150 })
    .withMessage("El título debe tener máximo 150 caracteres"),
  check("description")
    .optional({ nullable: true })
    .isLength({ max: 2000 })
    .withMessage("La descripción debe tener máximo 2000 caracteres"),
  check("status")
    .optional({ nullable: true })
    .isIn(allowedStatus)
    .withMessage(`El status debe ser: ${allowedStatus.join(", ")}`),
  check("priority")
    .optional({ nullable: true })
    .isIn(allowedPriority)
    .withMessage(`La prioridad debe ser: ${allowedPriority.join(", ")}`),
  (req, res, next) => validateResult(req, res, next),
];

export const validateTaskUpdate = [
  check().custom((_, { req }) => {
    const allowed = ["title", "description", "status", "priority"];
    const hasAny = allowed.some((k) => req.body[k] !== undefined);
    if (!hasAny)
      throw new Error("Debe enviar al menos un campo para actualizar");
    return true;
  }),

  check("title")
    .optional({ nullable: true })
    .notEmpty()
    .withMessage("El título no puede estar vacío")
    .isLength({ max: 150 })
    .withMessage("El título debe tener máximo 150 caracteres"),

  check("description")
    .optional({ nullable: true })
    .isLength({ max: 2000 })
    .withMessage("La descripción debe tener máximo 2000 caracteres"),

  check("status")
    .optional({ nullable: true })
    .isIn(allowedStatus)
    .withMessage(`El status debe ser: ${allowedStatus.join(", ")}`),

  check("priority")
    .optional({ nullable: true })
    .isIn(allowedPriority)
    .withMessage(`La prioridad debe ser: ${allowedPriority.join(", ")}`),

  (req, res, next) => validateResult(req, res, next),
];
