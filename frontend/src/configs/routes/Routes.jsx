import { Navigate } from "react-router-dom";
import Login from "@/views/login/Login.jsx";
import Register from "@/views/login/Register.jsx";
import Kanban from "@/views/kanban/Kanban.jsx";
import NotFound from "@/views/warnings/NotFound.jsx";

export const Routes = [
  { path: "/", element: <Navigate to="/kanban" replace /> },

  // Público: login / register
  {
    path: "/login",
    access: ["guest"],
    element: <Login />,
  },
  {
    path: "/register",
    access: ["guest"],
    element: <Register />,
  },

  // Protegido
  {
    path: "/kanban",
    access: ["auth"],
    element: <Kanban />,
  },

  // 404
  { path: "*", element: <NotFound /> },
];

export default Routes;
