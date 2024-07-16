import { DropResult } from 'react-beautiful-dnd';
import { updateTasks } from '@/services/task/taskService';
import { ColumnType } from '@/types/Column';
import { TaskType } from '@/types/Task';
import { Dispatch, SetStateAction } from 'react';

export const onDragEndTask = async (
  result: DropResult,
  columns: ColumnType[],
  tasks: TaskType[],
  setColumns: Dispatch<SetStateAction<ColumnType[]>>,
  setTasks: Dispatch<SetStateAction<TaskType[]>>,
) => {
  const { destination, source, draggableId } = result;

  if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
    return;
  }

  const updatedTasks = [...tasks];
  const movedTaskIndex = updatedTasks.findIndex(task => task.id === draggableId);
  const movedTask = updatedTasks[movedTaskIndex];

  if (source.droppableId === destination.droppableId) {
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
    updateTasks(sortedTasks);
  }
};
