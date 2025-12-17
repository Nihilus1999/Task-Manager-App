import { Task } from "../models/Task.js";
import { sequelize } from "../database/database.js";

// GET /tasks (solo del usuario autenticado)
export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await Task.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]]
    });

    return res.status(200).json({
      message: "Tareas obtenidas correctamente",
      data: tasks
    });
  } catch (error) {
    console.error("getTasks error:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      detail: error.parent?.message || error.message
    });
  }
};

// POST /tasks
export const createTask = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const { title, description, status, priority } = req.body;

    const task = await Task.create(
      {
        title,
        description: description ?? null,
        status: status ?? "pendiente",
        priority: priority ?? "media",
        user_id: userId
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(201).json({
      message: "Tarea creada correctamente",
      data: task
    });
  } catch (error) {
    await transaction.rollback();
    console.error("createTask error:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      detail: error.parent?.message || error.message
    });
  }
};

// PUT /tasks/:id (solo si pertenece al usuario)
export const updateTask = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const task = await Task.findOne({
      where: { id, user_id: userId },
      transaction
    });

    if (!task) {
      await transaction.rollback();
      return res.status(404).json({
        message: "No se encontró la tarea para este usuario"
      });
    }

    await task.update(req.body, { transaction });
    await transaction.commit();

    return res.status(200).json({
      message: "Tarea actualizada correctamente",
      data: task
    });
  } catch (error) {
    await transaction.rollback();
    console.error("updateTask error:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      detail: error.parent?.message || error.message
    });
  }
};

// DELETE /tasks/:id (solo si pertenece al usuario)
export const deleteTask = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const task = await Task.findOne({
      where: { id, user_id: userId },
      transaction
    });

    if (!task) {
      await transaction.rollback();
      return res.status(404).json({
        message: "No se encontró la tarea para este usuario"
      });
    }

    await task.destroy({ transaction });
    await transaction.commit();

    return res.status(200).json({
      message: "Tarea eliminada correctamente"
    });
  } catch (error) {
    await transaction.rollback();
    console.error("deleteTask error:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      detail: error.parent?.message || error.message
    });
  }
};

