import React, { FC, useState } from 'react';
import AddIcon from '../../../../assets/image/menuicon/addIcon.svg';
import { TaskType } from '@/types/Task';
import styles from './Column.module.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { ColumnTitleEdit } from '@/components/Kanban/components/ColumnTitleEdit/ColumnTitleEdit';
import { Draggable } from 'react-beautiful-dnd';
import { DeleteModal } from '@/components/DeleteModal/DeleteModal';
import { useKanbanContext } from '@/components/Kanban/providers/kanbanProvider/useKanbanContext';
import { ColumnType } from '@/types/Column';
import { FilterType } from '@/types/Filter';
import { Filters } from './../../Kanban';
import { Task } from '@/components/Kanban/components/Column/components/Task';
import { useUserDisplayDataMap } from '@/hooks/useUserDisplayDataMap';

interface ColumnProps {
  column: ColumnType;
  index: number;
}

export const Column: FC<ColumnProps> = ({ column, index }) => {
  const {
    tasks,
    users,
    handleColumnDelete,
    onAddNewTask,
    formik,
    isEditMode,
    handleTaskEdit,
    filters,
    getButtonStyle,
    handleTaskDelete,
    searchText,
  } = useKanbanContext();

  const [isDeleteColumnModalOpen, setIsDeleteColumnModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const hasTasksInColumn = (columnId: string) =>
    tasks.some((task: TaskType) => task.statusId !== undefined && task.statusId === columnId);

  const userDisplayDataMap = useUserDisplayDataMap(users);

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

  const handleOpenDeleteColumnModal = (columnId: string) => {
    setSelectedColumn(columnId);
    setIsDeleteColumnModalOpen(true);
  };

  const handleCloseDeleteColumnModal = () => {
    setSelectedColumn('');
    setIsDeleteColumnModalOpen(false);
  };

  return (
    <Draggable key={column.id} draggableId={column.id} index={index}>
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={styles.column}
          data-testid={`column${column.id}`}
        >
          <div className={styles.columnHead} {...provided.dragHandleProps}>
            <h2 className={styles.columnTitle}>
              <ColumnTitleEdit column={column} />
            </h2>
            {!hasTasksInColumn(column.id) && (
              <div>
                <button onClick={() => handleOpenDeleteColumnModal(column.id)} className={styles.deleteStatusButton}>
                  <DeleteIcon color="primary" />
                </button>
                <DeleteModal
                  title="Delete Column"
                  item={`column "${column.title}"`}
                  isOpen={isDeleteColumnModalOpen}
                  onClose={handleCloseDeleteColumnModal}
                  onDelete={async () => await handleColumnDelete(selectedColumn)}
                  testIdContext="Column"
                />
              </div>
            )}
            <button onClick={() => onAddNewTask(column.id)} className={styles.addButton}>
              <AddIcon />
            </button>
          </div>
          <Task
            column={column}
            isEditMode={isEditMode}
            handleTaskDelete={handleTaskDelete}
            getButtonStyle={getButtonStyle}
            userDisplayDataMap={userDisplayDataMap}
            formik={formik}
            tasksToRender={tasksToRender}
            handleTaskEdit={handleTaskEdit}
          />
        </div>
      )}
    </Draggable>
  );
};
