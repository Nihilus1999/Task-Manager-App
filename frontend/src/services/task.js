// src/services/tasks.service.js
import index from "@/configs/axios/index";

const statusMessages = {
  createTask: {
    success: "Tarea creada correctamente",
    error: {
      400: "Datos inválidos. Verifica el formulario.",
      401: "No autenticado. Inicia sesión nuevamente.",
      403: "No tienes permisos para crear tareas.",
      404: "Ruta no encontrada. Verifica el endpoint.",
      409: "Conflicto al crear la tarea.",
      422: "Validación fallida. Revisa los campos.",
      500: "Error en el servidor. Intenta más tarde.",
      default: "Ocurrió un error al crear la tarea.",
    },
  },
  getTasks: {
    success: "Tareas obtenidas correctamente",
    error: {
      401: "No autenticado. Inicia sesión nuevamente.",
      403: "No tienes permisos para ver tareas.",
      404: "Ruta no encontrada. Verifica el endpoint.",
      500: "Error en el servidor. Intenta más tarde.",
      default: "Ocurrió un error al obtener las tareas.",
    },
  },
  getTaskById: {
    success: "Tarea obtenida correctamente",
    error: {
      400: "Id inválido.",
      401: "No autenticado. Inicia sesión nuevamente.",
      403: "No tienes permisos para ver esta tarea.",
      404: "No se encontró la tarea.",
      500: "Error en el servidor. Intenta más tarde.",
      default: "Ocurrió un error al obtener la tarea.",
    },
  },
  updateTask: {
    success: "Tarea actualizada correctamente",
    error: {
      400: "Datos inválidos. Verifica el formulario.",
      401: "No autenticado. Inicia sesión nuevamente.",
      403: "No tienes permisos para actualizar tareas.",
      404: "No se encontró la tarea.",
      409: "Conflicto al actualizar la tarea.",
      422: "Validación fallida. Revisa los campos.",
      500: "Error en el servidor. Intenta más tarde.",
      default: "Ocurrió un error al actualizar la tarea.",
    },
  },
  deleteTask: {
    success: "Tarea eliminada correctamente",
    error: {
      400: "Id inválido.",
      401: "No autenticado. Inicia sesión nuevamente.",
      403: "No tienes permisos para eliminar tareas.",
      404: "No se encontró la tarea.",
      500: "Error en el servidor. Intenta más tarde.",
      default: "Ocurrió un error al eliminar la tarea.",
    },
  },
};

const resolveErrorMessage = (error, key) => {
  const status = error?.response?.status;

  const backendMsg =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.response?.data?.detail;

  if (backendMsg) return backendMsg;

  const map = statusMessages[key]?.error || {};
  return map[status] || map.default || "Error desconocido";
};

export const createTask = async (taskPayload) => {
  try {
    const response = await index.post("tasks", taskPayload);

    // Soporta backends que devuelven { data } o la entidad directa
    const data = response?.data?.data ?? response?.data;

    return {
      data,
      message: response?.data?.message || statusMessages.createTask.success,
    };
  } catch (error) {
    throw new Error(resolveErrorMessage(error, "createTask"));
  }
};

export const getTasks = async (params = {}) => {
  try {
    const response = await index.get("tasks", { params });

    const data = response?.data?.data ?? response?.data;

    return {
      data,
      message: response?.data?.message || statusMessages.getTasks.success,
    };
  } catch (error) {
    throw new Error(resolveErrorMessage(error, "getTasks"));
  }
};

export const getTaskById = async (id) => {
  try {
    const response = await index.get(`tasks/${id}`);

    const data = response?.data?.data ?? response?.data;

    return {
      data,
      message: response?.data?.message || statusMessages.getTaskById.success,
    };
  } catch (error) {
    throw new Error(resolveErrorMessage(error, "getTaskById"));
  }
};

export const updateTask = async (id, updates) => {
  try {
    const response = await index.put(`tasks/${id}`, updates);

    const data = response?.data?.data ?? response?.data;

    return {
      data,
      message: response?.data?.message || statusMessages.updateTask.success
    };
  } catch (error) {
    throw new Error(resolveErrorMessage(error, "updateTask"));
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await index.delete(`tasks/${id}`);

    return {
      message: response?.data?.message || statusMessages.deleteTask.success,
    };
  } catch (error) {
    throw new Error(resolveErrorMessage(error, "deleteTask"));
  }
};
