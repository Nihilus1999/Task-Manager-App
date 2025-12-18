import { useState } from "react";
import { useForm } from "react-hook-form";
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
  MenuItem,
  Stack
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { createTask } from "@/services/task";
import { PRIORITIES, TASK_STATUS } from "@/utils/kanbanConstants";

export default function TaskCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      priority: PRIORITIES.MEDIUM,
      status: TASK_STATUS.PENDING,
    },
    mode: "onTouched",
  });

  const closeSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setSuccess(false);
    setSnackbar((prev) => ({ ...prev, open: false }));

    try {
      await createTask(data);

      setSuccess(true);
      setSnackbar({
        open: true,
        severity: "success",
        message: "Tarea creada correctamente. Redirigiendo...",
      });

      setTimeout(() => {
        navigate("/kanban", { replace: true });
      }, 1500);
    } catch (e) {
      setSnackbar({
        open: true,
        severity: "error",
        message: e.message || "Error al crear la tarea",
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
        p: 2
      }}
    >
      <Card
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 500,
          borderRadius: 4,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" mb={2} spacing={1}>
            <Link component={RouterLink} to="/kanban" color="text.secondary">
              <ArrowBackIcon />
            </Link>
            <Typography variant="h5" fontWeight={700}>
              Nueva Tarea
            </Typography>
          </Stack>

          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mb: 3 }}
          >
            Completa la información para agregar al tablero.
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            
            <TextField
              label="Título de la tarea"
              fullWidth
              margin="normal"
              disabled={loading || success}
              error={Boolean(errors.title)}
              helperText={errors.title?.message}
              {...register("title", {
                required: "El título es obligatorio",
                minLength: {
                    value: 3,
                    message: "Mínimo 3 caracteres"
                }
              })}
            />

            <TextField
              label="Descripción"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              disabled={loading || success}
              error={Boolean(errors.description)}
              helperText={errors.description?.message}
              {...register("description", {
                required: "La descripción es obligatoria",
              })}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={1}>
                <TextField
                  select
                  label="Prioridad"
                  fullWidth
                  margin="normal"
                  disabled={loading || success}
                  defaultValue={PRIORITIES.MEDIUM}
                  inputProps={register("priority")}
                >
                    <MenuItem value={PRIORITIES.HIGH}>Alta</MenuItem>
                    <MenuItem value={PRIORITIES.MEDIUM}>Media</MenuItem>
                    <MenuItem value={PRIORITIES.LOW}>Baja</MenuItem>
                </TextField>

                <TextField
                  select
                  label="Estado Inicial"
                  fullWidth
                  margin="normal"
                  disabled={loading || success}
                  defaultValue={TASK_STATUS.PENDING}
                  inputProps={register("status")}
                >
                    <MenuItem value={TASK_STATUS.PENDING}>Pendiente</MenuItem>
                    <MenuItem value={TASK_STATUS.IN_PROGRESS}>En Progreso</MenuItem>
                    <MenuItem value={TASK_STATUS.COMPLETED}>Completada</MenuItem>
                </TextField>
            </Stack>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || success}
              sx={{
                mt: 4,
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
                "Creado con éxito"
              ) : (
                "Crear Tarea"
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        onClose={closeSnackbar}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          sx={{ fontWeight: "bold", width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}