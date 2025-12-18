import index from "@/configs/axios/index";

const message = {
  login: {
    400: "Datos inválidos. Verifica el formulario.",
    401: "Credenciales incorrectas. Revisa tu correo o contraseña.",
    403: "Acceso denegado.",
    404: "Servicio no disponible (Ruta no encontrada).",
    500: "Error del servidor. Intenta más tarde.",
    default: "No se pudo iniciar sesión. Intenta nuevamente."
  },
  register: {
    400: "Datos inválidos. Verifica el formulario.",
    404: "Servicio no disponible (Ruta no encontrada).",
    409: "El correo ya está registrado.",
    422: "Error de validación. Revisa los campos.",
    500: "Error del servidor. Intenta más tarde.",
    default: "No se pudo crear la cuenta. Intenta nuevamente."
  }
};

const getErrorMessage = (error, type) => {
  const response = error?.response;
  
  const backendMsg = response?.data?.message || response?.data?.error || response?.data?.detail;
  if (backendMsg) return backendMsg;

  const status = response?.status;
  return message[type][status] || message[type].default || "Error desconocido";
};

export const login = async (email, password) => {
  try {
    const { data } = await index.post("auth/login", { email, password });
    
    return {
      token: data.token,
      user: data.data || data.user, 
    };
  } catch (error) {
    throw new Error(getErrorMessage(error, "login"));
  }
};

export const register = async (email, password) => {
  try {
    await index.post("auth/register", { email, password });
    return true;
  } catch (error) {
    throw new Error(getErrorMessage(error, "register"));
  }
};