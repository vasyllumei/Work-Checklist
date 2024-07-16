import { DropResult } from 'react-beautiful-dnd';
import { TaskType } from '@/types/Task';
import { updateTasks } from '@/services/task/taskService';
import { Dispatch, SetStateAction } from 'react';

export const handleTaskDragEnd = async (
  result: DropResult,
  tasks: TaskType[],
  setTasks: Dispatch<SetStateAction<TaskType[]>>,
) => {
  const { source, destination } = result;

  if (!destination || source.index === destination.index) {
    return;
  }

  const updatedTasks = [...tasks];
  const movedTask = updatedTasks.splice(source.index, 1)[0];
  updatedTasks.splice(destination.index, 0, movedTask);

  updatedTasks.forEach((task, index) => {
    task.order = index + 1;
  });

  const sortedTasks = updatedTasks.sort((a, b) => a.order - b.order);

  setTasks(sortedTasks);

  try {
    await updateTasks(sortedTasks);
  } catch (error) {
    console.error('Error updating tasks:', error);
  }
};
