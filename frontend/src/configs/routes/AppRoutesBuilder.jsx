import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import appRoutes from "@/configs/routes/Routes";

const AppRoutesBuilder = () => {
  const { token } = useSelector((state) => state.auth);

  const buildRoute = (route) => {
    const access = route.access || [];

    // Rutas guest (login / register)
    if (access.includes("guest") && token) {
      return <Navigate to="/kanban" replace />;
    }

    // Rutas protegidas
    if (access.includes("auth") && !token) {
      return <Navigate to="/login" replace />;
    }

    return route.element;
  };

  return (
    <Routes>
      {appRoutes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={buildRoute(route)}
        />
      ))}
    </Routes>
  );
};

export default AppRoutesBuilder;