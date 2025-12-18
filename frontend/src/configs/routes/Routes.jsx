import { Navigate } from "react-router-dom";
import Login from "@/views/login/Login.jsx";
import Register from "@/views/login/Register.jsx";
import Kanban from "@/views/kanban/KanbanBoard.jsx";
import NotFound from "@/views/warnings/NotFound.jsx";
import TaskCreate from "@/views/task/TaskCreate";
import TaskUpdate from "@/views/task/TaskUpdate.jsx";

export const Routes = [
  { path: "/", element: <Navigate to="/kanban" replace /> },

  // Rutas publicas
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

  // Rutas protegidas con login
  {
    path: "/kanban",
    access: ["auth"],
    element: <Kanban />,
  },
   {
    path: "/create-task",
    access: ["auth"],
    element: <TaskCreate />,
  },
   {
    path: "/edit-task/:id",
    access: ["auth"],
    element: <TaskUpdate />,
  },

  // 404
  { path: "*", element: <NotFound /> },
];

export default Routes;
