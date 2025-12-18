import { useState, useEffect, useMemo } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { getTasks, updateTask } from "@/services/task"; 
import { BOARD_COLUMNS, TASK_STATUS, PRIORITIES } from "./kanbanConstants";

export const useKanbanBoard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState(null);
  
  const [filters, setFilters] = useState({
    priority: PRIORITIES.ALL,
    status: 'all',
  });

  const [notification, setNotification] = useState({ 
    open: false, 
    message: "", 
    severity: "success" 
  });

  const [tasksByStatus, setTasksByStatus] = useState({
    [TASK_STATUS.PENDING]: [],
    [TASK_STATUS.IN_PROGRESS]: [],
    [TASK_STATUS.COMPLETED]: [],
  });

  const filteredTasks = useMemo(() => {
    const currentTasks = { ...tasksByStatus };
    
    if (filters.priority === PRIORITIES.ALL && filters.status === 'all') {
      return currentTasks;
    }

    Object.keys(currentTasks).forEach((colId) => {
      currentTasks[colId] = currentTasks[colId].filter((task) => {
        const priorityMatch = filters.priority === PRIORITIES.ALL || task.priority === filters.priority;
        const statusMatch = filters.status === 'all' || colId === filters.status;
        return priorityMatch && statusMatch;
      });
    });

    return currentTasks;
  }, [tasksByStatus, filters]);

  // --- HELPERS ---
  const normalizeStatus = (status) => {
    const s = String(status || "").toLowerCase();
    return Object.values(TASK_STATUS).includes(s) ? s : TASK_STATUS.PENDING;
  };

  const findTaskById = (id) => {
    return Object.values(tasksByStatus).flat().find((t) => String(t.id) === String(id));
  };

  const getContainerId = (id) => {
    const strId = String(id);
    if (BOARD_COLUMNS.some((col) => col.id === strId)) return strId;
    
    return Object.keys(tasksByStatus).find((key) =>
      tasksByStatus[key].some((t) => String(t.id) === strId)
    );
  };

  const fetchTasks = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    
    try {
      const response = await getTasks();
      const list = Array.isArray(response) ? response : (response?.data || []);
      
      const grouped = {
        [TASK_STATUS.PENDING]: [],
        [TASK_STATUS.IN_PROGRESS]: [],
        [TASK_STATUS.COMPLETED]: [],
      };

      list.forEach((task) => {
        grouped[normalizeStatus(task.status)].push(task);
      });

      setTasksByStatus(grouped);
    } catch (error) {
      console.error(error);
      setNotification({ open: true, message: "Error al cargar tareas", severity: "error" });
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDragStart = ({ active }) => {
    setActiveTask(findTaskById(active.id));
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    
    const activeContainer = getContainerId(activeId);
    const overContainer = getContainerId(overId);

    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      const activeIndex = tasksByStatus[activeContainer].findIndex((t) => String(t.id) === activeId);
      const overIndex = tasksByStatus[overContainer].findIndex((t) => String(t.id) === overId);

      if (activeIndex !== overIndex) {
        setTasksByStatus((prev) => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex),
        }));
      }
      return;
    }

    const task = findTaskById(activeId);
    if (!task) return;

    setTasksByStatus((prev) => ({
      ...prev,
      [activeContainer]: prev[activeContainer].filter((t) => String(t.id) !== activeId),
      [overContainer]: [{ ...task, status: overContainer }, ...prev[overContainer]],
    }));

    try {
      await updateTask(task.id, { status: overContainer });
      setNotification({ open: true, message: "Estado actualizado", severity: "success" });
    } catch (error) {
      fetchTasks(); // Resincronizar si falla
      setNotification({ open: true, message: "Error al guardar cambios", severity: "error" });
    }
  };

  return {
    loading,
    tasksByStatus: filteredTasks, 
    activeTask,
    notification,
    filters,
    setFilters,
    setNotification,
    fetchTasks,
    dndHandlers: {
      onDragStart: handleDragStart,
      onDragCancel: () => setActiveTask(null),
      onDragEnd: handleDragEnd,
    },
  };
};