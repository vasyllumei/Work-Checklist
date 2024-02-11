import React, { FC, useState } from 'react';
import AddIcon from '../../../../assets/image/menuicon/addIcon.svg';
import EditIcon from '@mui/icons-material/Edit';
import { TaskType } from '@/types/Task';
import styles from './Column.module.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { TaskEditor } from '@/components/Kanban/components/TaskEditor/TaskEditor';
import { ColumnTitleEdit } from '@/components/Kanban/components/ColumnTitleEdit/ColumnTitleEdit';
import { Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '@/components/Kanban/components/StrictDroppable/StrictModeDroppable';
import { DeleteModal } from '@/components/DeleteModal/DeleteModal';
import { useKanbanContext } from '@/components/Context/KanbanContext';
import { ColumnType } from '@/types/Column';
import { UserType } from '@/types/User';
interface ColumnProps {
  column: ColumnType;
  index: number;
}
export const Column: FC<ColumnProps> = ({ column, index }) => {
  const {
    tasks,
    users,
    filteredTasks,
    handleColumnDelete,
    onAddNewTask,
    formik,
    isEditMode,
    handleTaskEdit,
    getButtonStyle,
    handleTaskDelete,
  } = useKanbanContext();

  const [isDeleteColumnModalOpen, setIsDeleteColumnModalOpen] = useState(false);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [selectedTask, setSelectedTask] = useState<{ id: string; title: string } | null>(null);

  const hasTasksInColumn = (columnId: string) =>
    tasks.some((task: TaskType) => task.statusId !== undefined && task.statusId === columnId);

  const userDisplayDataMap = new Map();

  users.forEach((user: UserType) => {
    const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`;
    const backgroundColor = user.iconColor ?? 'blue';

    userDisplayDataMap.set(user.id, { initials, backgroundColor });
  });

  const tasksToRender = filteredTasks.filter((task: TaskType) => task.statusId === column.id);

  const handleOpenDeleteColumnModal = (columnId: string) => {
    setSelectedColumn(columnId);
    setIsDeleteColumnModalOpen(true);
  };

  const handleCloseDeleteColumnModal = () => {
    setSelectedColumn('');
    setIsDeleteColumnModalOpen(false);
  };

  const handleOpenDeleteTaskModal = (taskId: string, taskTitle: string) => {
    setSelectedTask({ id: taskId, title: taskTitle });
    setIsDeleteTaskModalOpen(true);
  };

  const handleCloseDeleteTaskModal = () => {
    setIsDeleteTaskModalOpen(false);
  };

  return (
    <Draggable key={column.id} draggableId={column.id} index={index}>
      {provided => (
        <div ref={provided.innerRef} {...provided.draggableProps} key={index} className={styles.column}>
          <div className={styles.titleColumn} {...provided.dragHandleProps}>
            <h2 className={styles.title}>
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
                />
              </div>
            )}
            <button onClick={() => onAddNewTask(column.id)} className={styles.addButton}>
              <AddIcon />
            </button>
          </div>
          <StrictModeDroppable key={column.id} droppableId={column.id} type="TASK">
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps} className={styles.droppable}>
                {tasksToRender.map((task: TaskType, index: number) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {provided => (
                      <div ref={provided.innerRef} {...provided.draggableProps} className={styles.cardsContainer}>
                        <div className={styles.card} {...provided.dragHandleProps}>
                          {isEditMode && formik.values.id === task.id ? (
                            <TaskEditor />
                          ) : (
                            <div className={styles.contentContainer}>
                              <div className={styles.titleContainer}>
                                <h2 className={styles.title}>{task.title}</h2>
                                <div>
                                  <EditIcon onClick={() => handleTaskEdit(task.id)} className={styles.editIcon} />
                                  <DeleteIcon
                                    onClick={() => handleOpenDeleteTaskModal(task.id, task.title)}
                                    className={styles.editIcon}
                                  />
                                  <DeleteModal
                                    title="Delete Task"
                                    item={`task "${selectedTask?.title}"`}
                                    isOpen={isDeleteTaskModalOpen}
                                    onClose={handleCloseDeleteTaskModal}
                                    onDelete={async () => {
                                      if (selectedTask) {
                                        await handleTaskDelete(selectedTask.id);
                                        handleCloseDeleteTaskModal();
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                              <p>{task.description}</p>
                            </div>
                          )}
                          {!isEditMode || (isEditMode && formik.values.id !== task.id) ? (
                            <div className={styles.actionContainer}>
                              <div
                                key={index}
                                className={styles.avatar}
                                style={{
                                  backgroundColor: userDisplayDataMap.get(task.assignedTo)?.backgroundColor || 'blue',
                                }}
                              >
                                {userDisplayDataMap.get(task.assignedTo)?.initials}
                              </div>
                              <button style={getButtonStyle(task.buttonState)} className={styles.buttonAction}>
                                {task.buttonState}
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        </div>
      )}
    </Draggable>
  );
};
