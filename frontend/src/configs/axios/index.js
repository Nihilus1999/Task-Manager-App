import axios from "axios";

const baseURL = import.meta.env.VITE_LOCAL_HOST;

const index = axios.create({
  baseURL,
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

index.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (!config.params) {
      config.params = {};
    }
    config.params.t = Date.now();

    return config;
  },
  (error) => Promise.reject(error)
);

export default index;
