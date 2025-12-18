import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { register as registerService } from "@/services/auth.js";

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

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success", // success | error
    message: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
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
      await registerService(email, password);

      setSuccess(true);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Usuario creado correctamente. Redirigiendo al login...",
      });

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    } catch (e) {
      setSnackbar({
        open: true,
        severity: "error",
        message: e.message || "Error al crear la cuenta",
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
          {/* TÍTULOS */}
          <Typography
            variant="h5"
            fontWeight={700}
            textAlign="center"
            gutterBottom
          >
            Crear cuenta
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: "text.secondary", mb: 3 }}
          >
            Regístrate para comenzar a usar la aplicación
          </Typography>

          {/* FORM */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              label="Correo electrónico"
              fullWidth
              margin="normal"
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

            <TextField
              label="Confirmar contraseña"
              type="password"
              fullWidth
              margin="normal"
              disabled={loading || success}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "Debe confirmar la contraseña",
                validate: (value, formValues) =>
                  value === formValues.password ||
                  "Las contraseñas no coinciden",
              })}
            />

            {/* BOTÓN */}
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
                "Crear cuenta"
              )}
            </Button>

            {!success && (
              <Box display="flex" justifyContent="center" mt={3}>
                <Typography variant="body2" color="text.secondary">
                  ¿Ya tienes cuenta?{" "}
                  <Link
                    component={RouterLink}
                    to="/login"
                    underline="hover"
                    fontWeight={600}
                  >
                    Inicia sesión
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
