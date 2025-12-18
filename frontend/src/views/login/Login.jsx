import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { setCredentials } from "@/configs/redux/authSlice";
import { login } from "@/services/auth.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, type: "success", text: "" });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const handleCloseFeedback = (_, reason) => {
    if (reason === "clickaway") return;
    setFeedback((prev) => ({ ...prev, open: false }));
  };

  const processLogin = async ({ email, password }) => {
    setIsLoading(true);
    setIsSuccess(false);
    setFeedback((prev) => ({ ...prev, open: false }));

    try {
      const { token, user } = await login(email, password);

      setIsSuccess(true);
      setFeedback({
        open: true,
        type: "success",
        text: "Inicio de sesión exitoso. Redirigiendo...",
      });

      setTimeout(() => {
        dispatch(setCredentials({ token, user }));
        navigate("/kanban", { replace: true });
      }, 2000);

    } catch (error) {
      setFeedback({
        open: true,
        type: "error",
        text: error.message || "Error al iniciar sesión",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Card elevation={6} sx={{ width: "100%", maxWidth: 420, borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>
            Bienvenido
          </Typography>

          <Typography variant="body2" textAlign="center" color="text.secondary" mb={3}>
            Inicia sesión para continuar
          </Typography>

          <Box component="form" onSubmit={handleSubmit(processLogin)} noValidate>
            <TextField
              label="Correo electrónico"
              fullWidth
              margin="normal"
              autoComplete="email"
              disabled={isLoading || isSuccess}
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email", {
                required: "El correo es obligatorio",
                pattern: { value: EMAIL_PATTERN, message: "Correo inválido" },
              })}
            />

            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              margin="normal"
              autoComplete="current-password"
              disabled={isLoading || isSuccess}
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              })}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading || isSuccess}
              sx={{
                mt: 3,
                py: 1.4,
                borderRadius: 3,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : isSuccess ? "Redirigiendo..." : "Iniciar sesión"}
            </Button>

            {!isSuccess && (
              <Box display="flex" justifyContent="center" mt={3}>
                <Typography variant="body2" color="text.secondary">
                  ¿No tienes cuenta?{" "}
                  <Link component={RouterLink} to="/register" underline="hover" fontWeight={600}>
                    Regístrate
                  </Link>
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={feedback.open}
        onClose={handleCloseFeedback}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseFeedback} severity={feedback.type} sx={{ fontWeight: "bold" }}>
          {feedback.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}