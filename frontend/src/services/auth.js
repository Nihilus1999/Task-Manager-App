// src/services/auth.service.js
import index from "@/configs/axios/index";

const statusMessages = {
  login: {
    success: "Inicio de sesión exitoso. Redirigiendo...",
    error: {
      400: "Datos inválidos. Verifica el formulario.",
      401: "Credenciales inválidas. Verifica tu correo y contraseña.",
      403: "No tienes permisos para iniciar sesión.",
      404: "Ruta no encontrada. Verifica el endpoint.",
      500: "Error en el servidor. Intenta más tarde.",
      default: "Ocurrió un error. Intenta nuevamente."
    }
  },
  register: {
    success: "Usuario creado correctamente. Redirigiendo al login...",
    error: {
      400: "Datos inválidos. Verifica el formulario.",
      409: "Ya existe un usuario con ese correo.",
      422: "Validación fallida. Revisa los campos.",
      404: "Ruta no encontrada. Verifica el endpoint.",
      500: "Error en el servidor. Intenta más tarde.",
      default: "Ocurrió un error. Intenta nuevamente."
    }
  }
};

const resolveErrorMessage = (error, key) => {
  const status = error?.response?.status;

  // Si el backend envía un message útil, úsalo
  const backendMsg =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.response?.data?.detail;

  if (backendMsg) return backendMsg;

  const map = statusMessages[key]?.error || {};
  return map[status] || map.default || "Error desconocido";
};

export const login = async (email, password) => {
  try {
    const response = await index.post("auth/login", { email, password });
    const { token, data, message } = response.data;

    return {
      token,
      user: data,
      message: message || statusMessages.login.success
    };
  } catch (error) {
    throw new Error(resolveErrorMessage(error, "login"));
  }
};

// No devuelve nada (si fue OK simplemente no lanza error)
export const register = async (email, password) => {
  try {
    await index.post("auth/register", { email, password });
  } catch (error) {
    throw new Error(resolveErrorMessage(error, "register"));
  }
};
