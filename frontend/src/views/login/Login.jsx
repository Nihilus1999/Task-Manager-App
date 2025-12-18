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

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success", // "success" | "error" | "info" | "warning"
    message: "",
  });

  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const closeSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    setSuccess(false);
    setSnackbar((prev) => ({ ...prev, open: false }));

    try {
      const result = await login(email, password);

      setSuccess(true);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Inicio de sesión exitoso. Redirigiendo...",
      });

      setTimeout(() => {
        dispatch(
          setCredentials({
            token: result.token,
            user: result.user,
          })
        );
        navigate("/kanban", { replace: true });
      }, 2000);
    } catch (e) {
      setSnackbar({
        open: true,
        severity: "error",
        message: e.message || "Error al iniciar sesión",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        background: "linear-gradient(135deg, #f5f7fa, #e4ebf5)",
      }}
    >
      <Card
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            fontWeight={700}
            textAlign="center"
            gutterBottom
          >
            Bienvenido
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: "text.secondary", mb: 3 }}
          >
            Inicia sesión para continuar
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              label="Correo electrónico"
              fullWidth
              margin="normal"
              autoComplete="email"
              disabled={loading || success}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              {...register("email", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Correo inválido",
                },
              })}
            />

            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              margin="normal"
              autoComplete="current-password"
              disabled={loading || success}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 6,
                  message: "Debe tener al menos 6 caracteres",
                },
              })}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || success}
              sx={{
                mt: 3,
                py: 1.4,
                borderRadius: 3,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : success ? (
                "Redirigiendo..."
              ) : (
                "Iniciar sesión"
              )}
            </Button>

            {!success && (
              <Box display="flex" justifyContent="center" mt={3}>
                <Typography variant="body2" color="text.secondary">
                  ¿No tienes cuenta?{" "}
                  <Link
                    component={RouterLink}
                    to="/register"
                    underline="hover"
                    fontWeight={600}
                  >
                    Regístrate
                  </Link>
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        onClose={closeSnackbar}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          sx={{ fontWeight: "bold" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
