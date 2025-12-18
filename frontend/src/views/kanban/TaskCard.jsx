import { useNavigate } from "react-router-dom";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Paper, Typography, Box, Chip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { PRIORITIES } from "../../utils/kanbanConstants";
import { deleteTask } from "@/services/task";

const getPriorityColor = (priority) => {
  switch (String(priority).toLowerCase()) {
    case PRIORITIES.HIGH: return "error";
    case PRIORITIES.MEDIUM: return "warning";
    case PRIORITIES.LOW: return "success";
    default: return "default";
  }
};

export const TaskCard = ({ task, isOverlay = false, onDeleteSuccess }) => {
  const navigate = useNavigate();
  const priorityColor = getPriorityColor(task.priority);
  const isPriorityDefault = priorityColor === "default";

  const handleEditClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/edit-task/${task.id}`, { state: { task } });
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await deleteTask(task.id);
      if (onDeleteSuccess) {
        onDeleteSuccess(); 
      } else {
        console.warn("No se pasó la función onDeleteSuccess");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  return (
    <Paper
      elevation={isOverlay ? 8 : 1}
      sx={{
        p: 2,
        borderRadius: 2,
        cursor: isOverlay ? "grabbing" : "grab",
        border: "1px solid",
        borderColor: "divider",
        position: "relative",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: 3,
          "& .action-btn": { opacity: 1 }
        }
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1.3, flex: 1 }}>
          {task.title}
        </Typography>
        
        <Box display="flex">
            <IconButton 
              size="small" 
              className="action-btn"
              onClick={handleEditClick}
              onPointerDown={(e) => e.stopPropagation()}
              sx={{ 
                ml: 0.5, 
                mt: -0.5, 
                opacity: 0.6,
                transition: "opacity 0.2s",
                "&:hover": { color: "primary.main", opacity: 1 }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>

            <IconButton 
              size="small" 
              className="action-btn"
              onClick={handleDelete}
              onPointerDown={(e) => e.stopPropagation()}
              sx={{ 
                ml: 0.5, 
                mt: -0.5, 
                opacity: 0.6,
                transition: "all 0.2s",
                "&:hover": { color: "error.main", opacity: 1, bgcolor: 'error.lighter' }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
        </Box>
      </Box>
      
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          mb: 2, 
          display: '-webkit-box', 
          WebkitLineClamp: 3, 
          WebkitBoxOrient: 'vertical', 
          overflow: 'hidden',
          fontSize: '0.85rem'
        }}
      >
        {task.description}
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Chip 
          label={(task.priority || "Normal").toUpperCase()} 
          size="small" 
          color={priorityColor} 
          variant={isPriorityDefault ? "outlined" : "filled"}
          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
        />
        <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace' }}>
          #{String(task.id).slice(0, 4)}
        </Typography>
      </Box>
    </Paper>
  );
};

export const SortableTaskItem = ({ task, onDeleteSuccess }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(task.id) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onDeleteSuccess={onDeleteSuccess} />
    </div>
  );
}