import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import "@/assets/styles/app.scss";
import AppRoutesBuilder from "@/configs/routes/AppRoutesBuilder.jsx";
import { logout } from "@/configs/redux/authSlice";

function AppWrapper() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      try {
        const decoded = jwtDecode(token);
        const exp = decoded?.exp;

        if (!exp) {
          dispatch(logout());
          return;
        }

        const nowSeconds = Math.floor(Date.now() / 1000);
        const remaining = exp - nowSeconds;

        if (remaining <= 0) {
          clearInterval(interval);
          dispatch(logout());
        }
      } catch (error) {
        dispatch(logout());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [token, dispatch]);

  return <AppRoutesBuilder />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
