import React, { FC } from 'react';
import AddIcon from '../../../../assets/image/menuicon/addIcon.svg';
import { TaskType } from '@/types/Task';
import styles from './Column.module.css';
import { useKanbanContext } from '@/components/Kanban/providers/kanbanProvider/useKanbanContext';
import { ColumnType } from '@/types/Column';
import { FilterType } from '@/types/Filter';
import { Filters } from './../../Kanban';
import { Task } from '@/components/Kanban/components/Column/components/Task';
import { StrictModeDroppable } from '@/components/Kanban/components/StrictDroppable/StrictModeDroppable';

interface ColumnProps {
  column: ColumnType;
}

export const Column: FC<ColumnProps> = ({ column }) => {
  const { tasks, onAddNewTask, filters, searchText } = useKanbanContext();

  const filterTasks = (tasks: TaskType[]) => {
    const filteredTasks = tasks.filter(
      (task: TaskType) => !searchText || task.title.includes(searchText) || task.description.includes(searchText),
    );
    return filteredTasks.filter(task =>
      filters.every((filter: FilterType) => {
        if (filter.value.length === 0) {
          return true;
        }
        if (filter.name === Filters.ASSIGNED_TO) {
          return filter.value.includes(task.assignedTo);
        }
        if (filter.name === Filters.BUTTON_STATE) {
          return filter.value.includes(task.buttonState);
        }
        return true;
      }),
    );
  };

  const tasksToRender = filterTasks(tasks).filter((task: TaskType) => task.statusId === column.id);

  return (
    <div key={column.id} className={styles.column} data-testid={`column${column.id}`}>
      <div className={styles.columnHead}>
        <h2 className={styles.columnTitle}>
          <div className={styles.columnTitle}>
            <h3 className={styles.editInput}>{column.title}</h3>
          </div>
        </h2>
        <button onClick={() => onAddNewTask(column.id)} className={styles.addButton}>
          <AddIcon />
        </button>
      </div>
      <StrictModeDroppable droppableId={column.id} type="TASK">
        {provided => (
          <div ref={provided.innerRef} key={column.id} {...provided.droppableProps} className={styles.droppable}>
            {tasksToRender.map((task: TaskType, index: number) => (
              <Task key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </div>
  );
};
