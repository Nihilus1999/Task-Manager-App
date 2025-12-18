import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, useLocation, Link as RouterLink } from "react-router-dom";
import {
  Box, Card, CardContent, Typography, TextField, Button, Link,
  CircularProgress, Snackbar, Alert, MenuItem, Stack
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { updateTask } from "@/services/task";
import { PRIORITIES, TASK_STATUS } from "@/utils/kanbanConstants";

export default function TaskEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtenemos la tarea que viene desde el TaskCard
  const taskData = location.state?.task;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, type: "success", text: "" });

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: taskData?.title || "",
      description: taskData?.description || "",
      priority: taskData?.priority || PRIORITIES.MEDIUM,
      status: taskData?.status || TASK_STATUS.PENDING,
    },
    mode: "onTouched"
  });

  useEffect(() => {
    if (!taskData) {
      navigate("/kanban", { replace: true });
    }
  }, [taskData, navigate]);

  const handleCloseFeedback = (_, reason) => {
    if (reason === "clickaway") return;
    setFeedback((prev) => ({ ...prev, open: false }));
  };

  const processUpdate = async (data) => {
    setIsSubmitting(true);
    setIsSuccess(false);
    setFeedback((prev) => ({ ...prev, open: false }));

    try {
      await updateTask(id, data);
      
      setIsSuccess(true);
      setFeedback({ open: true, type: "success", text: "Tarea actualizada correctamente." });
      
      setTimeout(() => navigate("/kanban", { replace: true }), 1500);
    } catch (e) {
      setFeedback({ open: true, type: "error", text: e.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!taskData) return null; // Evita renderizado flash antes del redirect

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ background: "linear-gradient(135deg, #f5f7fa, #e4ebf5)", p: 2 }}
    >
      <Card elevation={6} sx={{ width: "100%", maxWidth: 500, borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          
          <Stack direction="row" alignItems="center" mb={2} spacing={1}>
            <Link component={RouterLink} to="/kanban" color="text.secondary">
              <ArrowBackIcon />
            </Link>
            <Typography variant="h5" fontWeight={700}>
              Editar Tarea
            </Typography>
          </Stack>

          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            Editando: <strong>{taskData.title}</strong>
          </Typography>

          <Box component="form" onSubmit={handleSubmit(processUpdate)} noValidate>
            <TextField
              label="Título"
              fullWidth
              margin="normal"
              disabled={isSubmitting || isSuccess}
              InputLabelProps={{ shrink: true }}
              error={!!errors.title}
              helperText={errors.title?.message}
              {...register("title", {
                required: "El título es obligatorio",
                minLength: { value: 3, message: "Mínimo 3 caracteres" }
              })}
            />

            <TextField
              label="Descripción"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              disabled={isSubmitting || isSuccess}
              InputLabelProps={{ shrink: true }}
              error={!!errors.description}
              helperText={errors.description?.message}
              {...register("description", { required: "La descripción es obligatoria" })}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={1}>
              <TextField
                select
                label="Prioridad"
                fullWidth
                margin="normal"
                disabled={isSubmitting || isSuccess}
                defaultValue={taskData.priority}
                inputProps={register("priority")}
              >
                <MenuItem value={PRIORITIES.HIGH}>Alta</MenuItem>
                <MenuItem value={PRIORITIES.MEDIUM}>Media</MenuItem>
                <MenuItem value={PRIORITIES.LOW}>Baja</MenuItem>
              </TextField>

              <TextField
                select
                label="Estado"
                fullWidth
                margin="normal"
                disabled={isSubmitting || isSuccess}
                defaultValue={taskData.status}
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
              disabled={isSubmitting || isSuccess}
              sx={{
                mt: 4, py: 1.4, borderRadius: 3,
                fontWeight: 600, textTransform: "none", fontSize: "1rem",
              }}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : isSuccess ? "Actualizado" : "Guardar Cambios"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={feedback.open}
        onClose={handleCloseFeedback}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseFeedback} severity={feedback.type}  sx={{ fontWeight: "bold", width: '100%' }}>
          {feedback.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}