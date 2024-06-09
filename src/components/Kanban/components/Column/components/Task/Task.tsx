import React, { FC, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { TaskType } from '@/types/Task';
import styles from './Task.module.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { TaskEditor } from '@/components/Kanban/components/TaskEditor/TaskEditor';
import { Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '@/components/Kanban/components/StrictDroppable/StrictModeDroppable';
import { DeleteModal } from '@/components/DeleteModal/DeleteModal';
import parse from 'html-react-parser';
import { ColumnType } from '@/types/Column';
import { FormikValues } from 'formik';
import { useDialogControl } from '@/hooks/useDialogControl';
interface TaskProps {
  column: ColumnType;
  isEditMode: boolean;
  handleTaskDelete: (taskId: string) => Promise<void>;
  getButtonStyle: (buttonState: string) => React.CSSProperties;
  userDisplayDataMap: Map<string, { initials: string; backgroundColor: string }>;
  formik: FormikValues;
  handleTaskEdit: (taskId: string) => void;
  tasksToRender: TaskType[];
}
export const Task: FC<TaskProps> = ({
  column,
  isEditMode,
  handleTaskDelete,
  getButtonStyle,
  userDisplayDataMap,
  formik,
  tasksToRender,
  handleTaskEdit,
}) => {
  const [selectedTask, setSelectedTask] = useState<{ id: string; title: string } | null>(null);
  const { isOpen: isDialogOpen, openDialog: openProjectDialog, closeDialog: closeProjectDialog } = useDialogControl();

  const handleOpenDeleteTaskModal = (taskId: string, taskTitle: string) => {
    setSelectedTask({ id: taskId, title: taskTitle });
    openProjectDialog();
  };

  const handleCloseDeleteTaskModal = () => {
    closeProjectDialog();
  };

  return (
    <StrictModeDroppable droppableId={column.id} type="TASK">
      {provided => (
        <div ref={provided.innerRef} key={column.id} {...provided.droppableProps} className={styles.droppable}>
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
                          <h2 className={styles.taskTitle}>{task.title}</h2>
                          <div>
                            <EditIcon onClick={() => handleTaskEdit(task.id)} className={styles.editIcon} />
                            <DeleteIcon
                              onClick={() => handleOpenDeleteTaskModal(task.id, task.title)}
                              className={styles.editIcon}
                            />
                            <DeleteModal
                              title="Delete Task"
                              item={`task "${selectedTask?.title}"`}
                              isOpen={isDialogOpen}
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
                        <div className={styles.taskDescription}>{parse(task.description)}</div>
                      </div>
                    )}
                    {!isEditMode || (isEditMode && formik.values.id !== task.id) ? (
                      <div className={styles.actionContainer}>
                        <div
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
  );
};
