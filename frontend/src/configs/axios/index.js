import axios from "axios";

const baseURL = import.meta.env.VITE_LOCAL_HOST;

const index = axios.create({
  baseURL,
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

export default index;