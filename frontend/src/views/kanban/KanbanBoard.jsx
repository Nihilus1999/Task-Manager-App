import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  Box,
  Container,
  LinearProgress,
  Typography,
  TextField,
  MenuItem,
  Stack,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";

// Redux & Router
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/configs/redux/authSlice";

import { useKanbanBoard } from "../../utils/useKanbanBoard";
import { BOARD_COLUMNS, PRIORITIES } from "../../utils/kanbanConstants";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";

export default function KanbanBoard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    loading,
    tasksByStatus,
    activeTask,
    dndHandlers,
    filters,
    setFilters,
    fetchTasks,
  } = useKanbanBoard();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff", py: 4 }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 5 } }}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "start", md: "center" }}
          mb={4}
          gap={2}
        >
          <Box>
            <Typography variant="h4" fontWeight={800} letterSpacing="-0.5px">
              Tablero Kanban
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gestión de flujo de trabajo
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
          >
            {/* Filtros */}
            <Stack direction="row" spacing={1} alignItems="center">
              <FilterListIcon color="action" />

              <TextField
                select
                label="Prioridad"
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
                size="small"
                sx={{ minWidth: 120 }}
              >
                <MenuItem value={PRIORITIES.ALL}>Todas</MenuItem>
                <MenuItem value={PRIORITIES.HIGH}>Alta</MenuItem>
                <MenuItem value={PRIORITIES.MEDIUM}>Media</MenuItem>
                <MenuItem value={PRIORITIES.LOW}>Baja</MenuItem>
              </TextField>

              <TextField
                select
                label="Columna"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                size="small"
                sx={{ minWidth: 140 }}
              >
                <MenuItem value="all">Ver todas</MenuItem>
                {BOARD_COLUMNS.map((col) => (
                  <MenuItem key={col.id} value={col.id}>
                    {col.title}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            {/* Botones de Acción */}
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/create-task")}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 3,
                }}
              >
                Nueva Tarea
              </Button>

              <Tooltip title="Cerrar sesión">
                <IconButton
                  onClick={handleLogout}
                  color="error"
                  sx={{
                    border: "1px solid",
                    borderColor: "error.light", // Borde sutil rojo
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: "error.lighter",
                    },
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Box>

        {loading && <LinearProgress sx={{ mb: 3 }} />}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          {...dndHandlers}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 3,
              width: "100%",
              alignItems: "start",
            }}
          >
            {BOARD_COLUMNS.map((col) => (
              <KanbanColumn
                key={col.id}
                id={col.id}
                title={col.title}
                tasks={tasksByStatus[col.id]}
                onDeleteSuccess={() => fetchTasks(false)}
              />
            ))}
            
          </Box>

          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </Container>
    </Box>
  );
}
