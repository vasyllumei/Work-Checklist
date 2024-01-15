import React from 'react';
import AddIcon from '../../../../assets/image/menuicon/addIcon.svg';
import EditIcon from '@mui/icons-material/Edit';
import { TaskType } from '@/types/Task';
import { ColumnType } from '@/types/Column';
import styles from './Column.module.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { TaskEditor } from '@/components/Kanban/components/TaskEditor/TaskEditor';
import { ColumnTitleEdit } from '@/components/Kanban/components/ColumnTitleEdit/ColumnTitleEdit';
import { UserType } from '@/types/User';
import { Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '@/components/Kanban/components/StrictDroppable/StrictModeDroppable';

type ColumnPropsType = {
  tasks: TaskType[];
  column: ColumnType;
  fetchData: () => void;
  isEditMode: boolean;
  handleTaskEdit: (taskId: string) => void;
  handleTaskDelete: (taskId: string) => void;
  isCardExpanded: (taskId: string) => boolean;
  isAddTaskModalOpen: boolean;
  getButtonStyle: (buttonState: string) => { backgroundColor: string };
  onAddNewTask: (columnId: string) => void;
  startEditingTask: (taskId: string) => void;
  formik: any;
  getFieldError: (fieldName: string) => string | undefined;
  handleSaveUpdatedTask: () => void;
  stopEditingTask: () => void;
  users: UserType[];
  index: number;
  onDelete: (columnId: string) => void;
  filteredTasks: TaskType[];
};
export const Column: React.FC<ColumnPropsType> = ({
  column,
  tasks,
  handleTaskEdit,
  handleTaskDelete,
  onAddNewTask,
  getButtonStyle,
  formik,
  getFieldError,
  handleSaveUpdatedTask,
  stopEditingTask,
  isEditMode,
  users,
  index,
  onDelete,
  filteredTasks,
}) => {
  const hasTasksInColumn = (columnId: string) =>
    tasks.some(task => task.statusId !== undefined && task.statusId === columnId);
  const userDisplayDataMap = new Map();

  users.forEach(user => {
    const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`;
    const backgroundColor = user.iconColor ?? 'blue';

    userDisplayDataMap.set(user.id, { initials, backgroundColor });
  });
  const tasksToRender = filteredTasks.filter(task => task.statusId === column.id);
  return (
    <Draggable key={column.id} draggableId={column.id} index={index}>
      {provided => (
        <div ref={provided.innerRef} {...provided.draggableProps} key={index} className={styles.column}>
          <div className={styles.titleColumn} {...provided.dragHandleProps}>
            <h2 className={styles.title}>
              <ColumnTitleEdit column={column} />
            </h2>
            {!hasTasksInColumn(column.id) && (
              <button onClick={() => onDelete(column.id)} className={styles.deleteStatusButton}>
                <DeleteIcon color="primary" />
              </button>
            )}
            <button onClick={() => onAddNewTask(column.id)} className={styles.addButton}>
              <AddIcon />
            </button>
          </div>
          <StrictModeDroppable key={column.id} droppableId={column.id} type="TASK">
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps} className={styles.droppable}>
                {tasksToRender.map((task: TaskType, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {provided => (
                      <div ref={provided.innerRef} {...provided.draggableProps} className={styles.cardsContainer}>
                        <div className={styles.card} {...provided.dragHandleProps}>
                          {isEditMode && formik.values.id === task.id ? (
                            <TaskEditor
                              formik={formik}
                              getFieldError={getFieldError}
                              getButtonStyle={getButtonStyle}
                              handleSaveUpdatedTask={handleSaveUpdatedTask}
                              stopEditingTask={stopEditingTask}
                            />
                          ) : (
                            <div className={styles.contentContainer}>
                              <div className={styles.titleContainer}>
                                <h2 className={styles.title}>{task.title}</h2>
                                <div>
                                  <EditIcon onClick={() => handleTaskEdit(task.id)} className={styles.editIcon} />
                                  <DeleteIcon onClick={() => handleTaskDelete(task.id)} className={styles.editIcon} />
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
