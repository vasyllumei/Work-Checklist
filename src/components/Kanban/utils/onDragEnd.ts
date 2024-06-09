import { DropResult } from 'react-beautiful-dnd';
import { ColumnType } from '@/types/Column';
import { TaskType } from '@/types/Task';
import { updateColumns } from '@/services/column/columnService';
import { updateTasks } from '@/services/task/taskService';
import { Dispatch, SetStateAction } from 'react';

const handleDragEnd = async (
  result: DropResult,
  columns: ColumnType[],
  tasks: TaskType[],
  setColumns: Dispatch<SetStateAction<ColumnType[]>>,
  setTasks: Dispatch<SetStateAction<TaskType[]>>,
) => {
  try {
    const { destination, source, type, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    if (type === 'COLUMN') {
      const updatedColumns = [...columns];
      const movedColumn = updatedColumns.splice(source.index, 1)[0];
      updatedColumns.splice(destination.index, 0, movedColumn);
      if (source.index !== destination.index) {
        updatedColumns.forEach((column, index) => {
          column.order = index + 1;
        });
      }

      setColumns(updatedColumns);
      await updateColumns(updatedColumns);
    } else if (type === 'TASK') {
      const updatedTasks = [...tasks];
      const movedTaskIndex = updatedTasks.findIndex(task => task.id === draggableId);

      if (movedTaskIndex !== -1) {
        const movedTask = updatedTasks[movedTaskIndex];
        if (source.droppableId === destination.droppableId) {
          const tasksInColumn = [...updatedTasks.filter(task => task.statusId === source.droppableId)];

          const sortedTasksInColumn = tasksInColumn.sort((a, b) => a.order - b.order);

          const movedTask = sortedTasksInColumn.splice(source.index, 1)[0];
          sortedTasksInColumn.splice(destination.index, 0, movedTask);

          sortedTasksInColumn.forEach((task, index) => {
            task.order = index + 1;
          });

          const updatedTasksCopy = [...updatedTasks];
          let columnIndex = 0;

          updatedTasksCopy.forEach((task, index) => {
            if (task.statusId === source.droppableId) {
              if (columnIndex < sortedTasksInColumn.length) {
                updatedTasksCopy[index] = sortedTasksInColumn[columnIndex++];
              }
            }
          });

          setTasks(updatedTasksCopy);

          await updateTasks(updatedTasksCopy);
        } else {
          movedTask.statusId = destination.droppableId;
          updatedTasks.splice(movedTaskIndex, 1);

          const tasksInDestinationColumn = updatedTasks.filter(task => task.statusId === destination.droppableId);
          const movedTaskClone = { ...movedTask };
          movedTaskClone.order = destination.index + 1;

          tasksInDestinationColumn.splice(destination.index, 0, movedTaskClone);

          tasksInDestinationColumn.forEach((task, index) => {
            task.order = index + 1;
          });

          const updatedTasksWithoutMoved = updatedTasks.filter(task => task.statusId !== destination.droppableId);
          updatedTasksWithoutMoved.push(...tasksInDestinationColumn);
          updatedTasks.splice(0, updatedTasks.length, ...updatedTasksWithoutMoved);

          const sortedTasks = updatedTasks.sort((a, b) => a.order - b.order);

          setTasks(sortedTasks);
          await updateTasks(sortedTasks);
        }
      }
    }
  } catch (error) {
    console.error('Error in onDragEnd:', error);
  }
};

export default handleDragEnd;
