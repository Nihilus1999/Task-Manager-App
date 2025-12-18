import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Box, Typography, Chip, Stack } from "@mui/material";
import { SortableTaskItem } from "./TaskCard";

export const KanbanColumn = ({ id, title, tasks }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Box
      sx={{
        backgroundColor: "#f4f5f7",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 400,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box 
        sx={{ 
          p: 2, 
          borderBottom: "1px solid rgba(0,0,0,0.05)", 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          {title}
        </Typography>
        <Chip label={tasks.length} size="small" sx={{ fontWeight: 700, height: 24 }} />
      </Box>

      <Box
        ref={setNodeRef}
        sx={{
          p: 1.5,
          flexGrow: 1,
          transition: "background-color 0.2s",
          backgroundColor: isOver ? "rgba(25, 118, 210, 0.04)" : "transparent",
        }}
      >
        <SortableContext
          items={tasks.map((t) => String(t.id))}
          strategy={verticalListSortingStrategy}
        >
          <Stack spacing={1.5}>
            {tasks.map((task) => (
              <SortableTaskItem key={task.id} task={task} />
            ))}
            
            {tasks.length === 0 && (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4, fontStyle: 'italic', opacity: 0.7 }}>
                Sin tareas
              </Typography>
            )}
          </Stack>
        </SortableContext>
      </Box>
    </Box>
  );
};